// Project type
enum ProjectStatus { Active, Finished }

class Project {
    constructor(
        public id: string, 
        public title: string, 
        public description: string, 
        public people: number,
        public status: ProjectStatus
    ) { }
}

// Project state management
type Listener = (items: Project[]) => void

class ProjectState {
    private listeners: Listener[] = []
    private projects: Project[] = []
    private static instance: ProjectState
    private constructor() {}

    static getInstance() {
        if(this.instance) {
            return this.instance
        }
        this.instance = new ProjectState()
        return this.instance
    }

    addListener(listenerLn: Listener) {
        this.listeners.push(listenerLn)
    }
    
    addProject(title: string, description: string, numOfPeople: number) {
        const newProject = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.Active)
        this.projects.push(newProject)
        for(const listenerFn of this.listeners) {
            listenerFn(this.projects.slice())
        }
    }
}

const projectState = ProjectState.getInstance()

// Validation
interface Validatable {
    value: string | number
    required?: boolean
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
}

function validate(validatableInput: Validatable) {
    let isValid = true
    // Required
    if(validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0
    }
    // Min length
    if(validatableInput.minLength != null && typeof validatableInput.value === "string") {
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength
    }
    // Max length
    if(validatableInput.maxLength != null && typeof validatableInput.value === "string") {
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength
    }
    // Min
    if(validatableInput.min != null && typeof validatableInput.value === "number") {
        isValid = isValid && validatableInput.value >= validatableInput.min
    }
    // Max
    if(validatableInput.max != null && typeof validatableInput.value === "number") {
        isValid = isValid && validatableInput.value <= validatableInput.max
    }
    return isValid
}

// Autobind decorator
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    let originalMethod = descriptor.value
    let adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            let boundFn = originalMethod.bind(this)
            return boundFn
        }
    }
    return adjDescriptor
}

// --------------------------------------------------
// ProjectList class
class ProjectList {
    templateElement: HTMLTemplateElement
    hostElement: HTMLElement
    element: HTMLElement
    assignedProjects: Project[]

    constructor(private type: "active" | "finished") {
        this.templateElement = document.getElementById("project-list")! as HTMLTemplateElement
        this.hostElement = document.getElementById("app")! as HTMLElement
        this.assignedProjects = []
        
        let importedNode = document.importNode(this.templateElement.content, true)
        this.element = importedNode.firstElementChild as HTMLElement
        this.element.id = `${this.type}-projects`

        projectState.addListener((projects: Project[]) => {
            this.assignedProjects = projects
            this.renderProjects()
        })

        this.attach()
        this.renderContent()
    }

    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement
        for(const prjItem of this.assignedProjects) {
            const listItem = document.createElement("li")
            listItem.textContent = prjItem.title
            listEl.appendChild(listItem)
        }
    }

    private renderContent() {
        let listId = `${this.type}-projects-list`
        this.element.querySelector("ul")!.id = listId
        this.element.querySelector("h2")!.textContent = this.type.toUpperCase() + " PROJECTS"
    }

    private attach() {
        this.hostElement.insertAdjacentElement("beforeend", this.element)
    }
}

// ProjectInput class
class ProjectInput {
    templateElement: HTMLTemplateElement
    hostElement: HTMLElement
    element: HTMLFormElement
    titleInputElement: HTMLInputElement
    descriptionInputElement: HTMLInputElement
    peopleInputElement: HTMLInputElement

    // --------------------------------------------------
    constructor() {
        this.templateElement = document.getElementById("project-input")! as HTMLTemplateElement
        this.hostElement = document.getElementById("app")! as HTMLElement
        
        let importedNode = document.importNode(this.templateElement.content, true)
        this.element = importedNode.firstElementChild as HTMLFormElement
        this.element.id = "user-input"
        // ----------------------------
        this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement
        this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement
        this.peopleInputElement = this.element.querySelector("#people") as HTMLInputElement
        // ----------------------------
        // Configure
        this.configure()
        // Attach
        this.attach()
    }

    private getherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value
        const enteredDescription = this.descriptionInputElement.value
        const enteredPeople = this.peopleInputElement.value
        // ----------------------------
        const titleValidatable: Validatable = { value: enteredTitle, required: true }
        const descriptionValidatable: Validatable = { value: enteredDescription, required: true, minLength: 5 }
        const peopleValidatable: Validatable = { value: +enteredPeople, required: true, min: 1, max: 5 }
        // ----------------------------
        if(
            !validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)
        ) {
            alert("Invalid input!")
            return
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople]
        }
    }

    private clearInputs() {
        this.titleInputElement.value = ""
        this.descriptionInputElement.value = ""
        this.peopleInputElement.value = ""
    }

    @autobind
    private submitHandler(event: Event) {
        event.preventDefault()
        // console.log(this.titleInputElement.value)
        let userInput = this.getherUserInput()
        if(Array.isArray(userInput)) {
            const [title, desc, people] = userInput
            projectState.addProject(title, desc, people)
            // console.log(title, desc, people)
            this.clearInputs()
        }
    }

    private configure() {
        this.element.addEventListener("submit", this.submitHandler)
    }

    private attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element)
    }
}


// --------------------------------------------------
const prjInput = new ProjectInput()
const activePrjList = new ProjectList("active")
const finishedPrjList = new ProjectList("finished")

