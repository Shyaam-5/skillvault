import React from "react";
import { ArrowRight, Bookmark, ChevronRight, Clock3, Star } from "lucide-react";
import { currency } from "../utils/currency";

export function CourseCard({ course, owned, saved, progress, onOpen, onSave, onLearn }) {
  return (
    <article className="course-card">
      <button className={`course-art art-${course.art}`} onClick={onOpen} aria-label={`View ${course.title}`}>
        <span className="art-category">{course.category}</span>
        <span className="art-emoji">{course.emoji}</span>
        <span className="art-bottom">
          <span>{course.level}</span>
          <span>
            <Clock3 size={13} /> {course.hours}h
          </span>
        </span>
      </button>
      <button className={`save-button ${saved ? "saved" : ""}`} onClick={onSave} aria-label={saved ? "Remove from wishlist" : "Save course"}>
        <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
      </button>
      <div className="course-card-body">
        <button className="course-title-button" onClick={onOpen}>
          <h3>{course.title}</h3>
        </button>
        <p className="course-instructor">{course.instructor}</p>
        <div className="course-rating">
          <strong>{course.rating || "New"}</strong>
          {course.rating > 0 && <Star size={13} fill="currentColor" />}
          <span>{course.students} learners</span>
        </div>
        <div className="course-price">
          <strong>{currency(course.price)}</strong>
          <del>{currency(course.oldPrice)}</del>
        </div>
        {owned ? (
          <div className="card-owned-row">
            <div className="progress-track">
              <i style={{ width: `${progress}%` }} />
            </div>
            <button className="button button-primary button-small" onClick={onLearn}>
              {progress ? "Continue" : "Start learning"} <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <button className="button button-outline full-width card-view-button" onClick={onOpen}>
            View course <ChevronRight size={15} />
          </button>
        )}
      </div>
    </article>
  );
}
