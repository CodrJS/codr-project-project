import { subject } from "@casl/ability";
import {
  Project,
  IProject,
  Utility,
  Error,
  Response,
  Types,
} from "@codrjs/models";
import MongoProject, { ProjectDocument } from "../entities/Project";
import ProjectAbility from "../entities/Project.ability";

type JwtPayload = Types.JwtPayload;

export class ProjectUtility extends Utility {
  // an internal method for getting the desired document to check against permissions
  protected async _getDocument<T>(id: string) {
    try {
      return (await MongoProject.findById(id)) as T;
    } catch (err) {
      throw new Error({
        status: 500,
        message: "Something went wrong when fetching project",
        details: {
          projectId: id,
          error: err,
        },
      });
    }
  }

  async get(token: JwtPayload, id: string) {
    // get desired project document
    const project = await this._getDocument<ProjectDocument>(id);

    // if project and read the document, send it, else throw error
    if (ProjectAbility(token).can("read", subject("Project", project))) {
      return new Response({
        message: "OK",
        details: {
          project: new Project(project),
        },
      });
    } else {
      throw new Error({
        status: 403,
        message: "User is forbidden from reading this project.",
      });
    }
  }

  async create(token: JwtPayload, obj: Omit<IProject, "createdBy">) {
    // if project can create projects
    if (ProjectAbility(token).can("create", "Project")) {
      try {
        // create project
        const project = await MongoProject.create({
          ...obj,
          createdBy: token.sub,
        });
        return new Response({
          message: "OK",
          details: {
            project: new Project(project),
          },
        });
      } catch (e) {
        throw new Error({
          status: 500,
          message:
            "An unexpected error occurred when trying to create a project.",
          details: e,
        });
      }
    } else {
      throw new Error({
        status: 403,
        message: "User is forbidden from creating projects.",
      });
    }
  }

  async update(token: JwtPayload, id: string, obj: Partial<IProject>) {
    // get desired project document
    const project = await this._getDocument<ProjectDocument>(id);

    // check permissions
    if (ProjectAbility(token).can("update", subject("Project", project))) {
      try {
        // update project.
        const project = (await MongoProject.findByIdAndUpdate(id, obj, {
          returnDocument: "after",
        })) as ProjectDocument;

        // return true if succeeded, else throw error
        return new Response({
          message: "OK",
          details: {
            project: new Project(project),
          },
        });
      } catch (e) {
        throw new Error({
          status: 500,
          message:
            "An unexpected error occurred when trying to update a project.",
          details: e,
        });
      }
    } else {
      throw new Error({
        status: 403,
        message: "User is forbidden from updating this project.",
      });
    }
  }

  /**
   * @todo Hard or soft delete projects?
   */
  async delete(_token: JwtPayload, _id: string) {
    throw new Error({
      status: 500,
      message: "Method not implemented.",
    });

    // expected return???
    return new Response({
      message: "OK",
      details: {
        project: undefined,
      },
    });
  }
}
