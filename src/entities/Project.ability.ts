import { Types } from "@codrjs/models";
import { ProjectDocument } from "./Project";

/**
 * Assume that the JwtPayload has been verified.
 * Using the Jwt, grant permission to accessing the database documents.
 */

const permissions: Types.Permissions<ProjectDocument, "Project"> = {
  "codr:system": (_token, { can }) => {
    can("manage", "Project");
  },
  "codr:admin": (_token, { can }) => {
    can("manage", "Project");
  },
  "codr:researcher": (token, { can }) => {
    // can only manage it's own projects and read public projects.
    can("read", "Project", { "flags.isPrivate": { $eq: false } });
    can("manage", "Project", { createdBy: token.sub });
  },
  "codr:annotator": (_token, { can }) => {
    // can only read public projects
    can("read", "Project", { "flags.isPrivate": { $eq: false } });
  },
};

const ProjectAbility = (token: Types.JwtPayload) =>
  Types.DefineAbility(token, permissions);
export default ProjectAbility;
