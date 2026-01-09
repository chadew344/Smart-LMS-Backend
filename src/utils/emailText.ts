export const accountUpgrade = (name: string) => `
Hello ${name},

🎉 Congratulations! Your account has been successfully upgraded to an INSTRUCTOR account.

What you can do now:
  • Create and manage your own courses
  • Upload and organize learning content
  • Engage and interact with your students

To get started, log in to your account and access your Instructor dashboard:

If you have any questions or need assistance, our support team is here to help.

Welcome aboard, and we're excited to see what you'll create!

- 🎓 Edumate
`;

export const courseEnroll = (
  studentName: string,
  courseName: string,
  instructorName: string
) => `
Hello ${studentName},

🎉 Congratulations! You are now enrolled in the course:

Course Name: "${courseName}"
Instructor: ${instructorName}

You can start learning right away by accessing the course dashboard:
https://smart-lms-frontend.vercel.app/dashboard/my-courses

Here's what you can do next:
  • View the course curriculum
  • Watch video lessons
  • Complete quizzes and assignments
  • Track your progress

We're excited to have you on this learning journey! 🚀

Happy learning,
- 🎓 Edumate
`;
