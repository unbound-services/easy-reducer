// import { schema } from "normalizr";

// const subjectSchema = new schema.Entity("subjects");
// const sessionSchema = new schema.Entity("sessions");
// const segmentRecordSchema = new schema.Entity("segmentRecord");
// const userSchema = new schema.Entity("users");
// const assignmentSchema = new schema.Entity("assignments");

// subjectSchema.define({
//   sessions: [sessionSchema],
// });

// sessionSchema.define({
//   user: subjectSchema,
//   supervisor_id: userSchema,
// });

// segmentRecordSchema.define({
//   session_id: sessionSchema,
// });

// userSchema.define({
//   sessions: [sessionSchema],
// // })

// assignmentSchema.define({
//   subject_id: [subjectSchema],
//   assigned_by: [userSchema]
// });

// export { subjectSchema, sessionSchema, segmentRecordSchema, userSchema, assignmentSchema };
