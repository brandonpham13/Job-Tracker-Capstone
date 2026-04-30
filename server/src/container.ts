import type { PrismaClient } from "@prisma/client";
import { UserStore } from "./store/user.js";
import { ApplicationStore } from "./store/application.js";
import { SkillStore } from "./store/skill.js";
import { ContactStore } from "./store/contact.js";

import { UserService } from "./services/user.js";
import { ApplicationService } from "./services/application.js";
import { SkillService } from "./services/skill.js";
import { ContactService } from "./services/contact.js";

export class Container {
    readonly userStore: UserStore;
    readonly applicationStore: ApplicationStore;
    readonly skillStore: SkillStore;
    readonly contactStore: ContactStore;

    readonly userService: UserService;
    readonly applicationService: ApplicationService;
    readonly skillService: SkillService;
    readonly contactService: ContactService;

    constructor(prisma: PrismaClient) {
        this.userStore = new UserStore(prisma);
        this.applicationStore = new ApplicationStore(prisma);
        this.skillStore = new SkillStore(prisma);
        this.contactStore = new ContactStore(prisma);

        this.userService = new UserService(this.userStore);
        this.applicationService = new ApplicationService(this.applicationStore);
        this.skillService = new SkillService(this.skillStore, this.applicationStore);
        this.contactService = new ContactService(this.contactStore, this.applicationStore);
    }
}
