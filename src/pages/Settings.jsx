import Heading from "../ui/Heading";
import Row from "../ui/Row.js";
import UpdateSettingsForm from "../features/settings/UpdateSettingsForm.jsx";

function Settings() {
  return (
      <Row>
        <Heading as="h1">Update hotel settings</Heading>
        <UpdateSettingsForm/>
      </Row>
  );
}

export default Settings;
