import { BriefcaseIcon } from "lucide-react";

import { ProgramPlaceholder } from "@/components/modules/programs/ProgramPlaceholder";

const InvestorsPage = () => (
  <ProgramPlaceholder
    title="Investors"
    description="Manage investor accounts, their stakes and payout schedules."
    icon={BriefcaseIcon}
  />
);

export default InvestorsPage;
