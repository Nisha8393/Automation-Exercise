// Launch args shared by the test projects and the pre-flight check.
// They must match: AutomationControlled hides the navigator.webdriver flag the
// site's bot check looks for, so a pre-flight without it can be blocked on a run
// the suite itself would pass.
export const LAUNCH_ARGS = [
  "--disable-blink-features=AutomationControlled",
  "--disable-dev-shm-usage",
  "--no-sandbox",
];
