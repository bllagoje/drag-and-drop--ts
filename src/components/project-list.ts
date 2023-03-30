// ProjectList class
import { DragTarget } from "../models/drag-drop"
import { Project, ProjectStatus } from "../models/project"
import Component from "./base-component"
import { autobind } from "../decorators/autobind"
import { projectState } from "../state/project-state"
import { ProjectItem } from "./project-item"

export class ProjectList extends Component<HTMLElement, HTMLElement> implements DragTarget {;
    assignedProjects: Project[]

    constructor(private type: "active" | "finished") {
        super("project-list", "app", false, `${type}-projects`)
        this.assignedProjects = []

        this.configure()
        this.renderContent()
    }

    @autobind
    dragOverHandler(event: DragEvent) {
        if(event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
            event.preventDefault()
            let listEl = this.element.querySelector("ul")!
            listEl.classList.add("droppable")
        }
    }

    @autobind
    dropHandler(event: DragEvent) {
        let prjId = event.dataTransfer!.getData("text/plain")
        projectState.moveProject(prjId, this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished)
    }

    @autobind
    dragLeaveHandler(_: DragEvent) {
        let listEl = this.element.querySelector("ul")!
        listEl.classList.remove("droppable")
    }

    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement
        listEl.innerHTML = ""
        for(const prjItem of this.assignedProjects) {
            new ProjectItem(this.element.querySelector("ul")!.id, prjItem)
        }
    }

    configure() {
        this.element.addEventListener("dragover", this.dragOverHandler)
        this.element.addEventListener("dragleave", this.dragLeaveHandler)
        this.element.addEventListener("drop", this.dropHandler)

        projectState.addListener((projects: Project[]) => {
            let relevantProjects = projects.filter(project => {
                if(this.type === "active") {
                    return project.status === ProjectStatus.Active
                } else {
                    return project.status === ProjectStatus.Finished
                }
            })
            this.assignedProjects = relevantProjects
            this.renderProjects()
        })
    }

    renderContent() {
        let listId = `${this.type}-projects-list`
        this.element.querySelector("ul")!.id = listId
        this.element.querySelector("h2")!.textContent = this.type.toUpperCase() + " PROJECTS"
    }
}

