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

  constructor() {
    this.userStore = new UserStore();
    this.jobStore = new JobStore();
    this.skillStore = new SkillStore();
    this.contactStore = new ContactStore();

    this.userService = new UserService(this.userStore);
    this.jobService = new JobService(this.jobStore);
    this.skillService = new SkillService(this.skillStore);
    this.contactService = new ContactService(this.contactStore);
  }
}
