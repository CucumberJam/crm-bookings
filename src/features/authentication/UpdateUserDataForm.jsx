import { useState } from "react";

import Button from "../../ui/Button.jsx";
import FileInput from "../../ui/FileInput.jsx";
import Form from "../../ui/Form.jsx";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import useGetUser from "./hooks/useGetUser.js";
import useUpdateUser from "./hooks/useUpdateUser.js";

function UpdateUserDataForm() {
  const {
    user: {
      email,
      user_metadata: { fullName: currentFullName, },
    },
  } = useGetUser();

  const {isUpdating, updateUser} = useUpdateUser();

  const [fullName, setFullName] = useState(currentFullName);
  const [avatar, setAvatar] = useState(null);
  function handleSubmit(e) {
    e.preventDefault();
    if(!fullName) return;
    updateUser({fullName, avatar}, {
        onSettled: ()=> {
            setFullName(currentFullName);
            setAvatar(null);
        }
    })
  }
  function handleReset() {
      setFullName(currentFullName);
      setAvatar(null);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email address">
        <Input value={email} disabled />
      </FormRow>
      <FormRow label="Full name">
        <Input
          type="text" disabled={isUpdating}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          id="fullName"/>
      </FormRow>
      <FormRow label="Avatar image">
        <FileInput
          id="avatar"
          accept="image/*" disabled={isUpdating}
          onChange={(e) => setAvatar(e.target.files[0])}/>
      </FormRow>
      <FormRow>
        <Button disabled={isUpdating}
                type="reset"
                variation="secondary"
                onClick={handleReset}>
          Cancel
        </Button>
        <Button disabled={isUpdating}>Update account</Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
