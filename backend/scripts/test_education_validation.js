const { validateStudentEducation } = require("../src/modules/onboarding/students/validations/studentEducation.validation");

const currentYear = new Date().getFullYear();

const testCases = [
    {
        name: "Valid: Current Year",
        data: { collegeName: "Test", degree: "B", graduationYear: currentYear, specialization: "CS" },
        expected: "success"
    },
    {
        name: "Valid: Future 8 Years",
        data: { collegeName: "Test", degree: "B", graduationYear: currentYear + 8, specialization: "CS" },
        expected: "success"
    },
    {
        name: "Invalid: Past Year",
        data: { collegeName: "Test", degree: "B", graduationYear: currentYear - 1, specialization: "CS" },
        expected: "fail"
    },
    {
        name: "Invalid: 9 Years Future",
        data: { collegeName: "Test", degree: "B", graduationYear: currentYear + 9, specialization: "CS" },
        expected: "fail"
    }
];

console.log(`Running tests for Graduation Year (${currentYear} to ${currentYear + 8}):\n`);

testCases.forEach(tc => {
    try {
        validateStudentEducation(tc.data);
        if (tc.expected === "success") {
            console.log(`✅ Passed: ${tc.name}`);
        } else {
            console.error(`❌ Failed: ${tc.name} (Should have failed)`);
        }
    } catch (e) {
        if (tc.expected === "fail") {
            console.log(`✅ Passed: ${tc.name} (Error: ${e.message})`);
        } else {
            console.error(`❌ Failed: ${tc.name} (Error: ${e.message})`);
        }
    }
});
