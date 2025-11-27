CREATE TABLE `students` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `birthdate` DATE NOT NULL
);

CREATE TABLE `courses` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT
);

CREATE TABLE `enrollments` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `student_id` INT NOT NULL,
  `course_id` INT NOT NULL,
  `enrolled_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`),
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`)
);

CREATE INDEX `fk_student_id` ON `enrollments`(`student_id`);
CREATE INDEX `fk_course_id` ON `enrollments`(`course_id`);
