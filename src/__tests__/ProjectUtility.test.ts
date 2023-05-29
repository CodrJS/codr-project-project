import { Error, IProject, Types as CodrTypes } from "@codrjs/models";
import { ProjectUtility } from "@/utils/ProjectUtility";
import { Types } from "mongoose";
import Project from "@/entities/Project";
import { randomUUID } from "crypto";
const Utility = new ProjectUtility();

type JwtPayload = CodrTypes.JwtPayload;

const testSystemUser: JwtPayload = {
  _id: new Types.ObjectId(0),
  type: "member",
  email: "system@codrjs.com",
  role: "codr:system",
  flags: {
    isDeleted: false,
    isDisabled: false,
    isAnonymous: false,
  },
  iss: "test-issuer.com",
  sub: new Types.ObjectId(0).toString(),
  jti: randomUUID(),
};

const testAdminUser: JwtPayload = {
  _id: new Types.ObjectId(1),
  type: "member",
  email: "admin@codrjs.com",
  role: "codr:admin",
  flags: {
    isDeleted: false,
    isDisabled: false,
    isAnonymous: false,
  },
  iss: "test-issuer.com",
  sub: new Types.ObjectId(1).toString(),
  jti: randomUUID(),
};

const testResearchUser: JwtPayload = {
  _id: new Types.ObjectId(2),
  type: "member",
  email: "researcher@codrjs.com",
  role: "codr:researcher",
  flags: {
    isDeleted: false,
    isDisabled: false,
    isAnonymous: false,
  },
  iss: "test-issuer.com",
  sub: new Types.ObjectId(2).toString(),
  jti: randomUUID(),
};

const testAnnotatorUser: JwtPayload = {
  _id: new Types.ObjectId(3),
  type: "member",
  email: "annotator@codrjs.com",
  role: "codr:annotator",
  flags: {
    isDeleted: false,
    isDisabled: false,
    isAnonymous: false,
  },
  iss: "test-issuer.com",
  sub: new Types.ObjectId(3).toString(),
  jti: randomUUID(),
};

const demoProject: Omit<IProject, "createdBy"> = {
  _id: new Types.ObjectId(4),
  name: "Demo Project",
  slug: "demo-project",
  bgColorClass: "bg-600-pink",
  type: CodrTypes.AnnotationTask.Classification,
  flags: {
    isDeleted: false,
    isPrivate: false,
    isAnonymized: true,
  },
  config: new Types.ObjectId(0),
};

describe("Project Utility: Create", () => {
  test("System can add project", async () => {
    // mock function returns once
    Project.create = jest
      .fn()
      .mockResolvedValueOnce({ ...demoProject, createdBy: testSystemUser.sub });

    // run tests
    const project = await Utility.create(testSystemUser, demoProject);
    expect(project.details.project.createdBy).toBe(testSystemUser.sub);
  });

  test("Admin can add project", async () => {
    // mock function returns once
    Project.create = jest
      .fn()
      .mockResolvedValueOnce({ ...demoProject, createdBy: testAdminUser.sub });

    // run tests
    const project = await Utility.create(testAdminUser, demoProject);
    expect(project.details.project.createdBy).toBe(testAdminUser.sub);
  });

  test("Researcher can add project", async () => {
    // mock function returns once
    Project.create = jest
      .fn()
      .mockResolvedValueOnce({
        ...demoProject,
        createdBy: testResearchUser.sub,
      });

    // run tests
    const project = await Utility.create(testResearchUser, demoProject);
    expect(project.details.project.createdBy).toBe(testResearchUser.sub);
  });

  test("Annotator cannot add project", () => {
    // mock function returns once
    Project.create = jest.fn().mockResolvedValueOnce(demoProject);

    // run tests
    expect(Utility.create(testAnnotatorUser, demoProject)).rejects.toEqual(
      new Error({
        status: 403,
        message: "User is forbidden from creating projects.",
      })
    );
  });
});

// describe("Project Utility: Read", () => {
//   test("System can read another project", async () => {
//     // mock function returns once
//     Project.findById = jest.fn().mockResolvedValueOnce(demoProject);

//     // run tests
//     const project = await Utility.get(
//       testSystemUser,
//       demoNewUser._id as unknown as string
//     );
//     expect(project.details.project.email).toBe("addproject@codrjs.com");
//   });

//   test("Admin can read another project", async () => {
//     // mock function returns once
//     Project.findById = jest.fn().mockResolvedValueOnce(demoProject);

//     // run tests
//     const project = await Utility.get(
//       testAdminUser,
//       demoNewUser._id as unknown as string
//     );
//     expect(project.details.project.email).toBe("addproject@codrjs.com");
//   });

//   test("Researcher can read own project", async () => {
//     // mock function returns once
//     User.findById = jest.fn().mockResolvedValueOnce(testResearchUser);

//     // run tests
//     const project = await Utility.get(
//       testResearchUser,
//       testResearchUser._id as unknown as string
//     );
//     expect(project.details.project.email).toBe("researcher@codrjs.com");
//   });

//   test("Annotator can read own project", async () => {
//     // mock function returns once
//     User.findById = jest.fn().mockResolvedValue(testAnnotatorUser);

//     // run tests
//     const project = await Utility.get(
//       testAnnotatorUser,
//       testAnnotatorUser._id as unknown as string
//     );
//     expect(project.details.project.email).toBe("annotator@codrjs.com");
//   });

//   test("Researcher cannot read another project", () => {
//     // mock function returns once
//     Project.findById = jest.fn().mockResolvedValueOnce(demoProject);

//     // run tests
//     expect(
//       Utility.get(testResearchUser, demoNewUser._id as unknown as string)
//     ).rejects.toEqual(
//       new Error({
//         status: 403,
//         message: "User is forbidden from reading this project.",
//       })
//     );
//   });

//   test("Annotator cannot read another project", () => {
//     // mock function returns once
//     Project.findById = jest.fn().mockResolvedValueOnce(demoProject);

//     // run tests
//     expect(
//       Utility.get(testAnnotatorUser, demoNewUser._id as unknown as string)
//     ).rejects.toEqual(
//       new Error({
//         status: 403,
//         message: "User is forbidden from reading this project.",
//       })
//     );
//   });
// });

// describe("Project Utility: Update", () => {
//   test("System can update another project", async () => {
//     // mock function returns once
//     Project.findById = jest.fn().mockResolvedValueOnce(demoProject);
//     User.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(demoNewUser);

//     // run tests
//     const project = await Utility.update(
//       testSystemUser,
//       demoNewUser._id as unknown as string,
//       demoNewUser
//     );
//     expect(project.details.project.email).toBe("addproject@codrjs.com");
//   });

//   test("System cannot update system project", async () => {
//     // mock function returns once
//     User.findById = jest.fn().mockResolvedValueOnce(testSystemUser);

//     // run tests
//     expect(
//       Utility.update(
//         testSystemUser,
//         testSystemUser._id as unknown as string,
//         testSystemUser
//       )
//     ).rejects.toEqual(
//       new Error({
//         status: 403,
//         message: "User is forbidden from updating this project.",
//       })
//     );
//   });

//   test("Admin can update another project", async () => {
//     // mock function returns once
//     User.findById = jest.fn().mockResolvedValueOnce(testAdminUser);
//     User.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(demoNewUser);

//     // run tests
//     const project = await Utility.update(
//       testAdminUser,
//       demoNewUser._id as unknown as string,
//       demoNewUser
//     );
//     expect(project.details.project.email).toBe("addproject@codrjs.com");
//   });

//   test("Admin cannot update system project", async () => {
//     // mock function returns once
//     User.findById = jest.fn().mockResolvedValueOnce(testSystemUser);

//     // run tests
//     expect(
//       Utility.update(
//         testResearchUser,
//         testSystemUser._id as unknown as string,
//         testSystemUser
//       )
//     ).rejects.toEqual(
//       new Error({
//         status: 403,
//         message: "User is forbidden from updating this project.",
//       })
//     );
//   });

//   test("Researcher cannot update projects", async () => {
//     // mock function returns once
//     Project.findById = jest.fn().mockResolvedValueOnce(demoProject);

//     // run tests
//     expect(
//       Utility.update(
//         testResearchUser,
//         demoNewUser._id as unknown as string,
//         demoNewUser
//       )
//     ).rejects.toEqual(
//       new Error({
//         status: 403,
//         message: "User is forbidden from updating this project.",
//       })
//     );
//   });

//   test("Annotator cannot update projects", async () => {
//     // mock function returns once
//     Project.findById = jest.fn().mockResolvedValueOnce(demoProject);

//     // run tests
//     expect(
//       Utility.update(
//         testAnnotatorUser,
//         demoNewUser._id as unknown as string,
//         demoNewUser
//       )
//     ).rejects.toEqual(
//       new Error({
//         status: 403,
//         message: "User is forbidden from updating this project.",
//       })
//     );
//   });
// });

/**
 * @TODO Add test cases for (soft) deleting a project.
 */
