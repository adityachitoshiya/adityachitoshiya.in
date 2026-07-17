import formidable from 'formidable';
console.log("Formidable import:", typeof formidable);
const form = formidable({});
console.log("Form created:", !!form);
