import type { PrismaClient } from "@prisma/client";
import { UserStore } from "./store/user.js";
import { ApplicationStore } from "./store/application.js";
import { SkillStore } from "./store/skill.js";
import { ContactStore } from "./store/contact.js";
import { ApplicationSkillStore } from "./store/applicationSkill.js";
import { ApplicationContactStore } from "./store/applicationContact.js";

import { UserService } from "./services/user.js";
import { ApplicationService } from "./services/application.js";
import { SkillService } from "./services/skill.js";
import { ContactService } from "./services/contact.js";
import { ApplicationSkillService } from "./services/applicationSkill.js";
import { ApplicationContactService } from "./services/applicationContact.js";
import type { JobService } from "./services/job.js";

export class Container {
  readonly userStore: UserStore;
  readonly applicationStore: ApplicationStore;
  readonly skillStore: SkillStore;
  readonly contactStore: ContactStore;
  readonly applicationContactStore: ApplicationContactStore;
  readonly applicationSkillStore: ApplicationSkillStore;

  readonly userService: UserService;
  readonly applicationService: ApplicationService;
  readonly jobService: JobService;
  readonly skillService: SkillService;
  readonly contactService: ContactService;
  readonly applicationContactService: ApplicationContactService;
  readonly applicationSkillService: ApplicationSkillService;

  constructor(prisma: PrismaClient) {
    this.userStore = new UserStore(prisma);
    this.applicationStore = new ApplicationStore(prisma);
    this.skillStore = new SkillStore(prisma);
    this.contactStore = new ContactStore(prisma);
    this.applicationContactStore = new ApplicationContactStore(prisma);
    this.applicationSkillStore = new ApplicationSkillStore(prisma);

    this.userService = new UserService(this.userStore);
    this.applicationService = new ApplicationService(this.applicationStore);
    this.jobService = this.applicationService;
    this.skillService = new SkillService(
      this.skillStore,
      this.applicationStore,
    );
    this.contactService = new ContactService(
      this.contactStore,
      this.applicationStore,
    );
    this.applicationSkillService = new ApplicationSkillService(prisma);
    this.applicationContactService = new ApplicationContactService(prisma);
  }
}
