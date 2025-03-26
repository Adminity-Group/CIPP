import { Grid, Stack } from "@mui/material";
import { CippWizardStepButtons } from "./CippWizardStepButtons";
import CippJsonView from "../CippFormPages/CippJSONView";
import CippFormComponent from "../CippComponents/CippFormComponent";
import CippFormCondition from "../CippComponents/CippFormCondition";
import { ApiGetCall } from "../../api/ApiCall";
import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";

export const CippScriptForm = (props) => {
  const { formControl, onPreviousStep, onNextStep, currentStep } = props;
  const values = formControl.getValues();
  const CATemplates = ApiGetCall({ url: "/api/ListScriptTemplates" });
  const [JSONData, setJSONData] = useState();
  const watcher = useWatch({ control: formControl.control, name: "TemplateList" });
  useEffect(() => {
    if (CATemplates.isSuccess && watcher?.value) {
      const template = CATemplates.data.find((template) => template.GUID === watcher.value);
      if (template) {
        const jsonTemplate = template.RAWJson ? JSON.parse(template.RAWJson) : null;
        setJSONData(jsonTemplate);
        formControl.setValue("RAWJson", template.RAWJson);
        formControl.setValue("displayName", template.Displayname);
        formControl.setValue("fileName", template.fileName);
        formControl.setValue("description", template.Description);
        formControl.setValue("ScriptType", template.Type);
        formControl.setValue("enforceSignatureCheck", template.enforceSignatureCheck);
        formControl.setValue("runAs32Bit", template.runAs32Bit);
        formControl.setValue("runAsAccount", template.runAsAccount);
      }
    }
  }, [CATemplates, watcher]);

  return (
    <Stack spacing={3}>
      <Stack spacing={3}>
        <CippFormComponent
          type="autoComplete"
          name="TemplateList"
          label="Please choose a Script to apply."
          isFetching={CATemplates.isLoading}
          multiple={false}
          formControl={formControl}
          options={
            CATemplates.isSuccess
              ? CATemplates.data.map((template) => ({
                  label: template.displayName,
                  value: template.GUID,
                }))
              : []
          }
        />

        <CippFormComponent
          type="hidden"
          name="rawjson"
          label="Script Parameters"
          placeholder="Enter the JSON information to use as parameters, or select from a template"
          formControl={formControl}
        />
        <CippJsonView object={JSONData} />

        <Grid item xs={12}>
          <CippFormComponent
            type="radio"
            name="AssignTo"
            options={[
              { label: "Do not assign", value: "On" },
              { label: "Assign to all users", value: "allLicensedUsers" },
              { label: "Assign to all devices", value: "AllDevices" },
              { label: "Assign to all users and devices", value: "AllDevicesAndUsers" },
              { label: "Assign to Custom Group", value: "customGroup" },
            ]}
            formControl={formControl}
          />
        </Grid>

        <CippFormCondition
          formControl={formControl}
          field="AssignTo"
          compareType="is"
          compareValue="customGroup"
        >
          <Grid item xs={12}>
            <CippFormComponent
              type="textField"
              label="Custom Group Names separated by comma. Wildcards (*) are allowed"
              name="customGroup"
              formControl={formControl}
              validators={{ required: "Please specify custom group names" }}
            />
          </Grid>
        </CippFormCondition>

        <CippFormComponent
          type="switch"
          name="overwrite"
          label="Overwrite Existing Script"
          formControl={formControl}
        />
      </Stack>
      <CippWizardStepButtons
        currentStep={currentStep}
        onPreviousStep={onPreviousStep}
        onNextStep={onNextStep}
        noNextButton={values.selectedOption === "UpdateTokens"}
        formControl={formControl}
        noSubmitButton={true}
      />
    </Stack>
  );
};
