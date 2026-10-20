import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Search, GraduationCap, Compass, BookOpen, PlayCircle,
  Settings, UserRound, Star, Clock3, ChevronRight, ChevronLeft, CheckCircle2,
  LockKeyhole, ArrowRight, Sparkles, ChartNoAxesCombined, Plus, Video, Users,
  IndianRupee, CircleHelp, Menu, X, Bookmark, BadgeCheck, UploadCloud, Trash2,
  ListChecks
} from "lucide-react";
import "./styles.css";
import { CourseCard } from "./components/CourseCard";
import { EmptyState } from "./components/EmptyState";
import { Metric } from "./components/Metric";
import { initialCourses } from "./data/initialCourses";
import { currency } from "./utils/currency";
import { readStorage } from "./utils/storage";

const loadCourses = () => {
  const storedCourses = readStorage("sv_courses", initialCourses);
  const storedIds = new Set(storedCourses.map(course => course.id));
  return [...storedCourses, ...initialCourses.filter(course => !storedIds.has(course.id))];
};

function App() {
  const [courses, setCourses] = useState(loadCourses);
  const [purchases, setPurchases] = useState(() => readStorage("sv_purchases", []));
  const [progress, setProgress] = useState(() => readStorage("sv_progress", {}));
  const [saved, setSaved] = useState(() => readStorage("sv_saved", []));
  const [page, setPage] = useState("Explore");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedId, setSelectedId] = useState("python");
  const [lessonIndex, setLessonIndex] = useState(0);
  const [notice, setNotice] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftPrice, setDraftPrice] = useState("999");
  const [draftCategory, setDraftCategory] = useState("Development");
  const [draftDescription, setDraftDescription] = useState("");
  const [draftLessons, setDraftLessons] = useState("Introduction\nCore concepts\nHands-on project");
  const [instructorTab, setInstructorTab] = useState("My courses");
  const [adminTab, setAdminTab] = useState("Overview");
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => localStorage.setItem("sv_courses", JSON.stringify(courses)), [courses]);
  useEffect(() => localStorage.setItem("sv_purchases", JSON.stringify(purchases)), [purchases]);
  useEffect(() => localStorage.setItem("sv_progress", JSON.stringify(progress)), [progress]);
  useEffect(() => localStorage.setItem("sv_saved", JSON.stringify(saved)), [saved]);
  useEffect(() => { if (notice) { const t = setTimeout(() => setNotice(""), 3600); return () => clearTimeout(t); } }, [notice]);

  const course = courses.find(c => c.id === selectedId) || courses[0];
  const owned = purchases.includes(course?.id);
  const categories = ["All", ...new Set(courses.map(c => c.category))];
  const filtered = useMemo(() => courses.filter(c => (category === "All" || c.category === category) && `${c.title} ${c.instructor} ${c.category}`.toLowerCase().includes(search.toLowerCase())), [courses, category, search]);
  const myCourses = courses.filter(c => purchases.includes(c.id));
  const progressPercent = (c) => Math.round(((progress[c.id] || []).length / (c.lessons?.length || 1)) * 100);
  const go = (next) => { setPage(next); setMobileMenu(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const selectCourse = (id, destination = "Course details") => { setSelectedId(id); setLessonIndex(0); go(destination); };
  const buyCourse = () => {
    if (!purchases.includes(course.id)) setPurchases(prev => [...prev, course.id]);
    go("My learning");
    setNotice(`Demo purchase successful — ${course.title} is now unlocked.`);
  };
  const markComplete = () => {
    const current = progress[course.id] || [];
    if (!current.includes(lessonIndex)) {
      setProgress(prev => ({ ...prev, [course.id]: [...(prev[course.id] || []), lessonIndex] }));
      setNotice("Lesson marked complete.");
    } else setNotice("This lesson is already complete.");
  };
  const toggleSaved = (id) => setSaved(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const createCourse = (e) => {
    e.preventDefault();
    const lessons = draftLessons.split("\n").map(s => s.trim()).filter(Boolean);
    if (!draftTitle.trim() || !lessons.length || Number(draftPrice) < 0) return;
    const next = { id: `course-${Date.now()}`, title: draftTitle.trim(), instructor: "You", category: draftCategory, price: Number(draftPrice), oldPrice: Math.round(Number(draftPrice) * 1.8), rating: 0, students: "0", hours: "New", level: "All levels", emoji: "📚", art: "purple", description: draftDescription.trim() || "A new course ready to be developed.", skills: lessons.slice(0, 4), lessons };
    setCourses(prev => [next, ...prev]);
    setDraftTitle(""); setDraftPrice("999"); setDraftDescription(""); setDraftLessons("Introduction\nCore concepts\nHands-on project");
    setInstructorTab("My courses"); setNotice("Course draft created. It's stored locally in this browser."); selectCourse(next.id, "Instructor");
  };
  const deleteCourse = (id) => {
    if (purchases.includes(id)) { setNotice("Purchased courses can't be deleted in this demo."); return; }
    setCourses(prev => prev.filter(c => c.id !== id));
    setNotice("Course removed from the local demo catalogue.");
  };
  const resetDemo = () => {
    setCourses(initialCourses); setPurchases([]); setProgress({}); setSaved([]);
    localStorage.removeItem("sv_courses"); localStorage.removeItem("sv_purchases"); localStorage.removeItem("sv_progress"); localStorage.removeItem("sv_saved");
    setConfirmReset(false); setNotice("Demo data reset.");
  };

  const navItems = [
    { label: "Explore", icon: Compass },
    { label: "My learning", icon: BookOpen },
    { label: "Instructor", icon: Video },
    { label: "Admin", icon: Settings }
  ];
  const nav = (items = navItems) => items.map(({ label, icon: Icon }) => (
    <button key={label} className={`nav-link ${page === label ? "active" : ""}`} onClick={() => go(label)}><Icon size={17}/><span>{label}</span>{label === "My learning" && purchases.length > 0 && <span className="nav-count">{purchases.length}</span>}</button>
  ));

  return <div className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={() => go("Explore")} aria-label="SkillVault home">
        <span className="brand-icon"><GraduationCap size={23}/></span>
        <span className="brand-copy"><strong>SkillVault</strong><small>LEARN SOMETHING VALUABLE.</small></span>
      </button>
      <div className="top-search"><Search size={18}/><input value={search} onChange={e => { setSearch(e.target.value); if (page !== "Explore") go("Explore"); }} placeholder="Search for anything" aria-label="Search courses"/><kbd>⌘ K</kbd></div>
      <nav className="desktop-nav">{nav()}</nav>
      <button className="icon-button mobile-menu-button" onClick={() => setMobileMenu(v => !v)} aria-label="Toggle navigation">{mobileMenu ? <X size={21}/> : <Menu size={21}/>}</button>
      <button className="avatar-button" title="Demo profile" onClick={() => go("My learning")}><UserRound size={18}/></button>
      {mobileMenu && <div className="mobile-nav">{nav()}</div>}
    </header>

    {notice && <div className="toast" role="status"><CheckCircle2 size={18}/><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Dismiss"><X size={16}/></button></div>}

    <main className="main-content">
      {page === "Explore" && <div className="page-stack">
        <section className="hero">
          <div className="hero-content">
            <div className="eyebrow"><Sparkles size={14}/> YOUR NEXT CHAPTER STARTS HERE</div>
            <h1>Invest in yourself.<br/><span>One skill at a time.</span></h1>
            <p>Learn from industry experts with practical courses you can revisit whenever you need them. Pay once, learn at your own pace.</p>
            <div className="hero-actions"><button className="button button-light" onClick={() => document.getElementById("course-catalogue")?.scrollIntoView({ behavior: "smooth" })}>Explore courses <ArrowRight size={17}/></button><span className="hero-proof"><span className="proof-avatars">S&nbsp; A&nbsp; P</span> <span>Skills for your next big move</span></span></div>
          </div>
          <div className="hero-art" aria-hidden="true"><div className="orb orb-one"></div><div className="orb orb-two"></div><div className="hero-card card-back"><span>✦</span><small>KEEP GROWING</small></div><div className="hero-card card-front"><div className="mini-course-art">🧠</div><div className="mini-lines"><b>Think. Build. Repeat.</b><span>Learning path · 8 lessons</span><div className="mini-progress"><i/></div></div><div className="hero-play"><PlayCircle size={24} fill="currentColor"/></div></div><div className="floating-tag"><BadgeCheck size={16}/> Skills that stick</div></div>
          <div className="hero-stats"><div><strong>Learn on your time</strong><span>On-demand lessons</span></div><div><strong>Pay once</strong><span>No recurring fees</span></div><div><strong>Keep your progress</strong><span>Pick up where you left off</span></div></div>
        </section>

        <section className="section" id="course-catalogue">
          <div className="section-heading"><div><div className="eyebrow muted">THE SKILLVAULT CATALOGUE</div><h2>Find your next skill</h2><p>Explore expert-led courses built for real-world progress.</p></div><div className="catalogue-count">{filtered.length} courses <ChevronRight size={16}/></div></div>
          <div className="category-pills">{categories.map(cat => <button key={cat} className={`category-pill ${category === cat ? "selected" : ""}`} onClick={() => setCategory(cat)}>{cat}</button>)}</div>
          {filtered.length ? <div className="course-grid">{filtered.map(c => <CourseCard key={c.id} course={c} owned={purchases.includes(c.id)} saved={saved.includes(c.id)} progress={progressPercent(c)} onOpen={() => selectCourse(c.id)} onSave={() => toggleSaved(c.id)} onLearn={() => selectCourse(c.id, "Player")}/>)}</div> : <EmptyState icon={Search} title="No courses found" text="Try another search or category." action="Clear filters" onAction={() => { setSearch(""); setCategory("All"); }}/>}
        </section>
        <section className="value-strip"><div className="value-icon"><LockKeyhole size={21}/></div><div><strong>One payment. Your learning library.</strong><p>In the full product, every purchase will unlock a course in your account, with progress saved securely.</p></div><button className="button button-outline" onClick={() => go("My learning")}>My learning <ArrowRight size={16}/></button></section>
      </div>}

      {page === "Course details" && <div className="page-stack"><button className="back-link" onClick={() => go("Explore")}><ChevronLeft size={17}/> Back to courses</button><section className="course-detail-layout"><div className="detail-main"><div className={`detail-banner art-${course.art}`}><div className="detail-banner-copy"><span className="detail-kicker">{course.category.toUpperCase()}</span><h1>{course.title}</h1><p>{course.description}</p><div className="detail-meta"><span><Star size={15} fill="currentColor"/> {course.rating || "New"} {course.rating ? `(${course.students} learners)` : "(New course)"}</span><span><Clock3 size={15}/> {course.hours} hours</span><span>{course.level}</span></div></div><div className="detail-emoji">{course.emoji}</div></div><div className="detail-section"><h2>What you'll learn</h2><div className="learning-points">{course.skills.map(skill => <div key={skill}><CheckCircle2 size={17}/><span>{skill}</span></div>)}</div></div><div className="detail-section curriculum"><div className="curriculum-heading"><div><h2>Course content</h2><p>{course.lessons.length} lessons · {course.hours} hours of learning</p></div><span>{progressPercent(course)}% complete</span></div>{course.lessons.map((lesson, i) => <button key={lesson} className="lesson-row" onClick={() => { if (purchases.includes(course.id)) { setLessonIndex(i); go("Player"); } else if (i === 0) { setLessonIndex(i); setNotice("Preview mode: full lesson playback will be connected in the production version."); } else setNotice("Purchase this course to unlock all lessons."); }}><span className={`lesson-icon ${(progress[course.id] || []).includes(i) ? "done" : ""}`}>{(progress[course.id] || []).includes(i) ? <CheckCircle2 size={17}/> : <PlayCircle size={17}/>}</span><span className="lesson-name">{lesson}</span><span className="lesson-trailing">{i === 0 ? "Preview" : `Lesson ${i + 1}`}<ChevronRight size={15}/></span></button>)}</div><div className="detail-section instructor-bio"><div className="instructor-avatar">{course.instructor.split(" ").map(s => s[0]).join("").slice(0, 2)}</div><div><span className="eyebrow muted">YOUR INSTRUCTOR</span><h3>{course.instructor}</h3><p>Industry practitioner focused on helping learners build practical, job-ready skills.</p></div></div></div><aside className="purchase-card"><div className={`purchase-art art-${course.art}`}><span>{course.emoji}</span><div className="art-play"><PlayCircle size={30}/></div></div><div className="purchase-card-body"><div className="price-line"><strong>{currency(course.price)}</strong><del>{currency(course.oldPrice)}</del><span className="discount">{Math.max(0, Math.round((1 - course.price / (course.oldPrice || course.price)) * 100))}% off</span></div><p className="access-note"><CheckCircle2 size={16}/> One-time payment · lifetime access model</p>{purchases.includes(course.id) ? <button className="button button-primary full-width" onClick={() => go("Player")}>Continue learning <ArrowRight size={17}/></button> : <button className="button button-primary full-width" onClick={() => go("Checkout")}>Buy this course <ArrowRight size={17}/></button>}<button className={`button button-outline full-width save-course ${saved.includes(course.id) ? "is-saved" : ""}`} onClick={() => toggleSaved(course.id)}><Bookmark size={16} fill={saved.includes(course.id) ? "currentColor" : "none"}/>{saved.includes(course.id) ? "Saved to wishlist" : "Save for later"}</button><div className="purchase-includes"><strong>This course includes</strong><span><Video size={16}/>{course.hours} hours of on-demand video</span><span><BookOpen size={16}/>{course.lessons.length} lessons</span><span><Bookmark size={16}/>Access from your learning library</span><span><CircleHelp size={16}/>Practice-focused curriculum</span></div><p className="demo-note">Prototype only. Payments are simulated; no money is collected.</p></div></aside></section></div>}

      {page === "Checkout" && <div className="narrow-page"><button className="back-link" onClick={() => go("Course details")}><ChevronLeft size={17}/> Back to course</button><div className="checkout-heading"><span className="eyebrow muted">CHECKOUT</span><h1>Make this skill yours.</h1><p>One payment, then learn at your own pace.</p></div><div className="checkout-layout"><div className="checkout-summary card-surface"><h2>Order summary</h2><div className="checkout-course"><div className={`checkout-thumb art-${course.art}`}>{course.emoji}</div><div><strong>{course.title}</strong><span>By {course.instructor}</span><small>{course.lessons.length} lessons · {course.hours} hours</small></div></div><div className="summary-line"><span>Course price</span><strong>{currency(course.price)}</strong></div><div className="summary-line discount-line"><span>Launch discount</span><strong>−{currency(Math.max(0, course.oldPrice - course.price))}</strong></div><div className="summary-line total-line"><strong>Total due today</strong><strong>{currency(course.price)}</strong></div><div className="secure-note"><LockKeyhole size={17}/><span>Demo checkout. This prototype does not collect payment details.</span></div></div><div className="checkout-action card-surface"><div className="checkout-step"><span>1</span><div><strong>Review your course</strong><p>Confirm the course and one-time price.</p></div></div><div className="checkout-step"><span>2</span><div><strong>Simulate payment</strong><p>No card details required for this demo.</p></div></div><div className="checkout-step"><span>3</span><div><strong>Start learning</strong><p>Your course will appear in My learning.</p></div></div><button className="button button-primary full-width checkout-confirm" onClick={buyCourse}><LockKeyhole size={17}/> Confirm demo purchase · {currency(course.price)}</button><p className="terms-note">By continuing, you acknowledge this is a simulated purchase for a local prototype.</p></div></div></div>}

      {page === "My learning" && <div className="page-stack"><section className="dashboard-welcome"><div><span className="eyebrow">YOUR LEARNING SPACE</span><h1>Keep that momentum going.</h1><p>Your courses, progress, and next steps — all in one place.</p></div><div className="welcome-mark"><GraduationCap size={45}/></div></section><div className="metric-grid"><Metric icon={BookOpen} label="Courses owned" value={myCourses.length}/><Metric icon={ChartNoAxesCombined} label="Lessons completed" value={myCourses.reduce((n, c) => n + (progress[c.id] || []).length, 0)}/><Metric icon={BadgeCheck} label="Courses completed" value={myCourses.filter(c => progressPercent(c) === 100).length}/></div><section className="section"><div className="section-heading compact"><div><h2>My courses</h2><p>Pick up where you left off.</p></div><button className="button button-outline" onClick={() => go("Explore")}>Browse courses <ArrowRight size={16}/></button></div>{myCourses.length ? <div className="course-grid">{myCourses.map(c => <CourseCard key={c.id} course={c} owned saved={saved.includes(c.id)} progress={progressPercent(c)} onOpen={() => selectCourse(c.id)} onSave={() => toggleSaved(c.id)} onLearn={() => selectCourse(c.id, "Player")}/>)}</div> : <EmptyState icon={BookOpen} title="Your learning library is waiting" text="Explore the catalogue and purchase a course in the demo to see it here." action="Explore courses" onAction={() => go("Explore")}/>}</section>{saved.length > 0 && <section className="section"><div className="section-heading compact"><div><h2>Your wishlist</h2><p>Courses you've saved for later.</p></div></div><div className="course-grid">{courses.filter(c => saved.includes(c.id)).map(c => <CourseCard key={c.id} course={c} owned={purchases.includes(c.id)} saved progress={progressPercent(c)} onOpen={() => selectCourse(c.id)} onSave={() => toggleSaved(c.id)} onLearn={() => selectCourse(c.id, "Player")}/>)}</div></section>}</div>}

      {page === "Player" && <div className="page-stack"><button className="back-link" onClick={() => go(purchases.includes(course.id) ? "My learning" : "Course details")}><ChevronLeft size={17}/> {purchases.includes(course.id) ? "Back to my learning" : "Back to course"}</button>{!purchases.includes(course.id) ? <EmptyState icon={LockKeyhole} title="This course is locked" text="Purchase the course in this demo to unlock the lesson list and progress tracking." action="View course" onAction={() => go("Course details")}/> : <section className="player-layout"><div className="player-main"><div className="video-stage"><div className="video-glow"></div><div className="video-placeholder-icon"><PlayCircle size={64}/></div><h2>{course.lessons[lessonIndex]}</h2><p>Sample player · video hosting will be connected in the production version</p><div className="fake-video-controls"><span>▶</span><div className="fake-track"><i/></div><span>00:00 / —</span><span>⚙</span></div></div><div className="player-info"><span className="eyebrow muted">NOW LEARNING</span><h1>{course.title}</h1><p>{course.description}</p><div className="player-actions"><button className="button button-outline" disabled={lessonIndex === 0} onClick={() => setLessonIndex(i => Math.max(0, i - 1))}><ChevronLeft size={17}/> Previous lesson</button><button className="button button-primary" onClick={markComplete}>{(progress[course.id] || []).includes(lessonIndex) ? <CheckCircle2 size={17}/> : <ListChecks size={17}/>} {(progress[course.id] || []).includes(lessonIndex) ? "Completed" : "Mark complete"}</button><button className="button button-outline" disabled={lessonIndex === course.lessons.length - 1} onClick={() => setLessonIndex(i => Math.min(course.lessons.length - 1, i + 1))}>Next lesson <ChevronRight size={17}/></button></div></div></div><aside className="curriculum-panel"><div className="curriculum-panel-head"><h2>Course content</h2><span>{progressPercent(course)}% complete</span><div className="progress-bar"><i style={{ width: `${progressPercent(course)}%` }}/></div></div>{course.lessons.map((l, i) => <button key={l} className={`player-lesson ${i === lessonIndex ? "current" : ""}`} onClick={() => setLessonIndex(i)}><span className={`lesson-icon ${(progress[course.id] || []).includes(i) ? "done" : ""}`}>{(progress[course.id] || []).includes(i) ? <CheckCircle2 size={17}/> : <PlayCircle size={17}/>}</span><span className="player-lesson-text"><strong>{i + 1}. {l}</strong><small>{i === lessonIndex ? "Currently playing" : "Recorded lesson"}</small></span><ChevronRight size={15}/></button>)}</aside></section>}</div>}

      {page === "Instructor" && <div className="page-stack"><section className="dashboard-welcome instructor-welcome"><div><span className="eyebrow">INSTRUCTOR STUDIO</span><h1>Share what you know.</h1><p>Shape a course, organize lessons, and prepare your learning content.</p></div><div className="welcome-mark"><Video size={42}/></div></section><div className="metric-grid"><Metric icon={BookOpen} label="Your courses" value={courses.filter(c => c.instructor === "You").length}/><Metric icon={Users} label="Demo purchases" value={purchases.length}/><Metric icon={IndianRupee} label="Simulated sales" value={currency(courses.filter(c => purchases.includes(c.id)).reduce((n, c) => n + c.price, 0))}/></div><div className="tab-bar">{["My courses", "Create course"].map(t => <button key={t} className={instructorTab === t ? "selected" : ""} onClick={() => setInstructorTab(t)}>{t === "Create course" && <Plus size={16}/>} {t}</button>)}</div>{instructorTab === "Create course" ? <form className="editor-card" onSubmit={createCourse}><div className="editor-heading"><div className="editor-icon"><UploadCloud size={22}/></div><div><h2>Create a course draft</h2><p>Build the course outline for your marketplace listing.</p></div></div><label>Course title<input required value={draftTitle} onChange={e => setDraftTitle(e.target.value)} placeholder="e.g. Complete React Masterclass"/></label><div className="form-row"><label>Category<select value={draftCategory} onChange={e => setDraftCategory(e.target.value)}>{["Development", "AI & Data Science", "Data", "Design", "Business", "Marketing", "Productivity"].map(c => <option key={c}>{c}</option>)}</select></label><label>Price (INR)<input type="number" min="0" required value={draftPrice} onChange={e => setDraftPrice(e.target.value)}/></label></div><label>Course description<textarea rows="3" value={draftDescription} onChange={e => setDraftDescription(e.target.value)} placeholder="What will students learn?"/></label><label>Lessons <span className="label-hint">One lesson per line</span><textarea rows="5" required value={draftLessons} onChange={e => setDraftLessons(e.target.value)} placeholder={"Introduction\\nCore concepts\\nHands-on project"}/></label><div className="upload-placeholder"><UploadCloud size={24}/><strong>Video uploads are not connected yet</strong><span>Add video hosting in Phase 2. This draft stores lesson titles only.</span></div><button className="button button-primary" type="submit"><Plus size={17}/> Save course draft</button></form> : <section className="editor-card"><div className="section-heading compact"><div><h2>Course catalogue</h2><p>Courses currently available in this local demo.</p></div><button className="button button-primary" onClick={() => setInstructorTab("Create course")}><Plus size={16}/> New course</button></div><div className="management-list">{courses.filter(c => c.instructor === "You").length === 0 && <div className="empty-inline">Your new course drafts will appear here.</div>}{courses.filter(c => c.instructor === "You").map(c => <div className="management-row" key={c.id}><div className={`management-emoji art-${c.art}`}>{c.emoji}</div><div className="management-info"><strong>{c.title}</strong><span>{c.category} · {c.lessons.length} lessons · {currency(c.price)}</span></div><span className="status-badge">Draft</span><button className="icon-button danger" onClick={() => deleteCourse(c.id)} aria-label={`Delete ${c.title}`}><Trash2 size={17}/></button></div>)}</div></section>}</div>}

      {page === "Admin" && <div className="page-stack"><section className="dashboard-welcome admin-welcome"><div><span className="eyebrow">PLATFORM OPERATIONS</span><h1>SkillVault control room.</h1><p>Review the catalogue and inspect demo activity. This panel is not access-protected yet.</p></div><div className="welcome-mark"><Settings size={42}/></div></section><div className="metric-grid"><Metric icon={BookOpen} label="Course listings" value={courses.length}/><Metric icon={Users} label="Demo purchases" value={purchases.length}/><Metric icon={IndianRupee} label="Simulated sales value" value={currency(courses.filter(c => purchases.includes(c.id)).reduce((n, c) => n + c.price, 0))}/></div><div className="tab-bar">{["Overview", "Courses", "Demo data"].map(t => <button key={t} className={adminTab === t ? "selected" : ""} onClick={() => setAdminTab(t)}>{t}</button>)}</div>{adminTab === "Overview" && <div className="admin-grid"><div className="editor-card"><h2>Platform health</h2><div className="health-row"><span className="health-dot"/><span>Frontend prototype</span><strong>Running locally</strong></div><div className="health-row"><span className="health-dot amber"/><span>Payment integration</span><strong>Simulated</strong></div><div className="health-row"><span className="health-dot amber"/><span>Authentication</span><strong>Not connected</strong></div><div className="health-row"><span className="health-dot amber"/><span>Video delivery</span><strong>Not connected</strong></div></div><div className="editor-card"><h2>Next production tasks</h2>{["Secure user authentication and roles", "Payment verification and refunds", "Protected video playback", "Instructor verification and moderation"].map((x, i) => <div className="task-row" key={x}><span>{i + 1}</span>{x}</div>)}</div></div>}{adminTab === "Courses" && <section className="editor-card"><div className="section-heading compact"><div><h2>All courses</h2><p>Manage the local demo catalogue.</p></div><span className="catalogue-count">{courses.length} total</span></div><div className="management-list">{courses.map(c => <div className="management-row" key={c.id}><div className={`management-emoji art-${c.art}`}>{c.emoji}</div><div className="management-info"><strong>{c.title}</strong><span>{c.instructor} · {c.category} · {currency(c.price)}</span></div><button className="button button-outline button-small" onClick={() => selectCourse(c.id)}>View</button>{c.instructor === "You" && <button className="icon-button danger" onClick={() => deleteCourse(c.id)} aria-label={`Delete ${c.title}`}><Trash2 size={17}/></button>}</div>)}</div></section>}{adminTab === "Demo data" && <section className="editor-card"><h2>Reset local demo</h2><p className="muted-copy">Reset course drafts, purchases, lesson progress, and wishlist saved in this browser. This cannot be undone.</p>{!confirmReset ? <button className="button button-danger" onClick={() => setConfirmReset(true)}><Trash2 size={16}/> Reset demo data</button> : <div className="confirm-row"><strong>Are you sure?</strong><button className="button button-danger" onClick={resetDemo}>Yes, reset</button><button className="button button-outline" onClick={() => setConfirmReset(false)}>Cancel</button></div>}</section>}</div>}
    </main>
    <footer className="footer"><button className="brand footer-brand" onClick={() => go("Explore")}><span className="brand-icon"><GraduationCap size={20}/></span><span className="brand-copy"><strong>SkillVault</strong><small>LEARN SOMETHING VALUABLE.</small></span></button><span>Prototype build · Demo data stays in this browser</span><button className="footer-link" onClick={() => go("Admin")}><Settings size={14}/> Admin console</button></footer>
  </div>;
}

createRoot(document.getElementById("root")).render(<React.StrictMode><App/></React.StrictMode>);
