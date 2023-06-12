// Course Class
class Course {
  constructor(title, instructor, image) {
    this.courseId = Math.floor(Math.random() * 10000);
    this.title = title;
    this.instructor = instructor;
    this.image = image;
  }
}

//UI Class
class UI {
  addCourseToList(course) {
    const list = document.getElementById('course-list');

    var html = `
    <tr>
              <td class="w-25"><img class="align-items-center justify-content-center d-flex w-50" src="img/${course.image}" alt="Course Picture"/></td>
              <td class="w-25">${course.title}</td>
              <td class="w-25">${course.instructor}</td>
              <td class="text-center w-25 "><a href="#" data-id="${course.courseId}" class="w-75 btn btn-danger delete">Delete</a></td>
          </tr>
          `;

    list.innerHTML += html;
  }

  clearControls() {
    const title = (document.getElementById('title').value = '');
    const instructor = (document.getElementById('instructor').value = '');
    const image = (document.getElementById('image').value = '');
  }

  deleteCourse(element) {
    if (element.classList.contains('delete')) {
      element.parentElement.parentElement.remove();
      return true;
    }
  }

  showAlert(message, className) {
    var alert = `
    <div class="alert alert-${className}">
        ${message}
    </div>
    `;

    const row = document.querySelector('.row');
    //beforeBegin, afterBegin, beforeEnd, afterEnd
    row.insertAdjacentHTML('beforeBegin', alert);
    setTimeout(() => {
      document.querySelector('.alert').remove();
    }, 2000);
  }
}

// Storage Class
class Storage {
  static getCourses() {
    let courses;
    if (localStorage.getItem('courses') === null) {
      courses = [];
    } else {
      courses = JSON.parse(localStorage.getItem('courses'));
    }
    return courses;
  }

  static displayCourse() {
    const courses = Storage.getCourses();
    courses.forEach((course) => {
      const ui = new UI();
      ui.addCourseToList(course);
    });
  }

  static addCourse(course) {
    const courses = Storage.getCourses();
    courses.push(course);
    localStorage.setItem('courses', JSON.stringify(courses));
  }

  static deleteCourse(element) {
    if (element.classList.contains('delete')) {
      const id = element.getAttribute('data-id');
      const courses = Storage.getCourses();

      courses.forEach((course, index) => {
        if (course.courseId == id) {
          courses.splice(index, 1);
        }
      });

      localStorage.setItem('courses', JSON.stringify(courses));
    }
  }
}

document.addEventListener('DOMContentLoaded', Storage.displayCourse);

document.querySelector('#new-course').addEventListener('submit', function (e) {
  const title = document.getElementById('title').value;
  const instructor = document.getElementById('instructor').value;
  const image = document.getElementById('image').value;

  // Create Course Object
  const course = new Course(title, instructor, image);

  // Create UI
  const ui = new UI();

  if (title === '' || instructor === '' || image === '') {
    ui.showAlert('Please Complete the Form', 'warning');
  } else {
    // Add Course to List
    ui.addCourseToList(course);

    // Save to Local Storage
    Storage.addCourse(course);

    // Clear Controls
    ui.clearControls();

    ui.showAlert('The Course has been Added', 'success');
  }

  e.preventDefault();
});

document.getElementById('course-list').addEventListener('click', function (e) {
  const ui = new UI();
  // Delete Course
  if (ui.deleteCourse(e.target) == true) {
    // Delete from Local Storage
    Storage.deleteCourse(e.target);

    ui.showAlert('The Course has been Delete', 'danger');
  }
});
