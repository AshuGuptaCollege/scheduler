import React from 'react';
import 'rbx/index.css';
import { Button } from 'rbx';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import hasConflict from './times';

const firebaseConfig = {
  apiKey: "AIzaSyCuFf9lnNfXvVZGCsoGKuqy0zp4yqr4sAg",
  authDomain: "scheduler-41ed5.firebaseapp.com",
  databaseURL: "https://scheduler-41ed5.firebaseio.com",
  projectId: "scheduler-41ed5",
  storageBucket: "",
  messagingSenderId: "543717696227",
  appId: "1:543717696227:web:8e1371efc252a1782d9bd6"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref();

const meetsPat = /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;

const timeParts = meets => {
  const [match, days, hh1, mm1, hh2, mm2] = meetsPat.exec(meets) || [];
  return !match ? {} : {
    days,
    hours: {
      start: hh1 * 60 + mm1 * 1,
      end: hh2 * 60 + mm2 * 1
    }
  };
};

const Course = ({ course, state, user }) => (
  <Button color={ buttonColor(state.selected.includes(course)) }
    onClick={ () => state.toggle(course) }
    onDoubleClick={ user ? () => moveCourse(course) : null }
    disabled={ hasConflict(course, state.selected) }
    >
    { getCourseTerm(course) } CS { getCourseNumber(course) }: { course.title }
  </Button>
);

const moveCourse = course => {
  const meets = prompt('Enter new meeting data, in this format:', course.meets);
  if (!meets) return;
  const {days} = timeParts(meets);
  if (days) saveCourse(course, meets);
  else moveCourse(course);
};

const saveCourse = (course, meets) => {
  db.child('courses').child(course.id).update({meets})
    .catch(error => alert(error));
};

const terms = { F: 'Fall', W: 'Winter', S: 'Spring'};

const getCourseTerm = course => (
  terms[course.id.charAt(0)]
);

const getCourseNumber = course => (
  course.id.slice(1, 4)
)

const buttonColor = selected => (
  selected ? 'success' : null
);

export default Course;
