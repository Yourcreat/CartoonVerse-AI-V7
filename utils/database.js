const fs = require("fs");
const path = require("path");

const PROJECT_FOLDER = path.join(__dirname, "..", "data", "projects");

if (!fs.existsSync(PROJECT_FOLDER)) {
  fs.mkdirSync(PROJECT_FOLDER, { recursive: true });
}

function saveProject(projectName, data) {
  const file = path.join(PROJECT_FOLDER, `${projectName}.json`);

  fs.writeFileSync(
    file,
    JSON.stringify(data, null, 2)
  );
}

function loadProject(projectName) {
  const file = path.join(PROJECT_FOLDER, `${projectName}.json`);

  if (!fs.existsSync(file)) {
    return null;
  }

  return JSON.parse(
    fs.readFileSync(file, "utf8")
  );
}

function deleteProject(projectName) {
  const file = path.join(PROJECT_FOLDER, `${projectName}.json`);

  if (!fs.existsSync(file)) {
    return false;
  }

  fs.unlinkSync(file);

  return true;
}

function listProjects() {
  return fs.readdirSync(PROJECT_FOLDER)
    .filter(file => file.endsWith(".json"))
    .map(file => file.replace(".json", ""));
}

function getCharacter(projectName) {
  const project = loadProject(projectName);

  if (!project) return null;

  return project.character || null;
}

module.exports = {
  saveProject,
  loadProject,
  deleteProject,
  listProjects,
  getCharacter
};
