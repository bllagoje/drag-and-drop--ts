// Drag and drop interfaces
/// <reference path="models/drag-drop.ts" />
// Project type
/// <reference path="models/project.ts" />
// Project state management
/// <reference path="state/project-state.ts" />
// Validation
/// <reference path="util/validation.ts" />
// Autobind decorator
/// <reference path="decorators/autobind.ts" />
// ProjectList
/// <reference path="components/project-list.ts" />
// ProjectInput
/// <reference path="components/project-input.ts" />

// --------------------------------------------------
namespace App {
    new ProjectInput()
    new ProjectList("active")
    new ProjectList("finished")
}    


