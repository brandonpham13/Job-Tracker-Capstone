import type { PrismaClient } from "@prisma/client";
import { UserStore } from "./store/user.js";
import { JobStore } from "./store/job.js";
import { SkillStore } from "./store/skill.js";
import { ContactStore } from "./store/contact.js";

import { UserService } from "./services/user.js";
import { JobService } from "./services/job.js";
import { SkillService } from "./services/skill.js";
import { ContactService } from "./services/contact.js";

export class Container {
    readonly userStore: UserStore;
    readonly jobStore: JobStore;
    readonly skillStore: SkillStore;
    readonly contactStore: ContactStore;

    readonly userService: UserService;
    readonly jobService: JobService;
    readonly skillService: SkillService;
    readonly contactService: ContactService;

    constructor(prisma: PrismaClient) {
        this.userStore = new UserStore(prisma);
        this.jobStore = new JobStore(prisma);
        this.skillStore = new SkillStore(prisma);
        this.contactStore = new ContactStore(prisma);

        this.userService = new UserService(this.userStore);
        this.jobService = new JobService(this.jobStore);
        this.skillService = new SkillService(this.skillStore, this.jobStore);
        this.contactService = new ContactService(this.contactStore, this.jobStore);
    }
}
