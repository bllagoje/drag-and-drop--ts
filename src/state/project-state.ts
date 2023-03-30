// Project state management
namespace App {
    type Listener<T> = (items: T[]) => void
        
    class State<T> {
        protected listeners: Listener<T>[] = []
        
        addListener(listenerLn: Listener<T>) {
            this.listeners.push(listenerLn)
        }
    }

    export class ProjectState extends State<Project> {
        private projects: Project[] = []
        private static instance: ProjectState
        
        private constructor() {
            super()
        }

        static getInstance() {
            if(this.instance) {
                return this.instance
            }
            this.instance = new ProjectState()
            return this.instance
        }
        
        addProject(title: string, description: string, numOfPeople: number) {
            const newProject = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.Active)
            this.projects.push(newProject)
            this.updateListeners()
        }

        moveProject(projectId: string, newStatus: ProjectStatus) {
            let project = this.projects.find(prj => prj.id === projectId)
            if(project && project.status !== newStatus) {
                project.status = newStatus
                this.updateListeners()
            }
        }

        private updateListeners() {
            for(const listenerFn of this.listeners) {
                listenerFn(this.projects.slice())
            }
        }
    }

    export const projectState = ProjectState.getInstance()
}
