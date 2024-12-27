export const setupRequestHandler = (ipcMain) => {
  ipcMain.handle("fetch-data", async (event, data) => {
    console.log("Starting data fetch...");
    console.log("Request Data:", data);

    try {
      const { url, username, apiToken } = data;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Basic " + btoa(`${username}:${apiToken}`),
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const responseData = await response.json();
      console.log("API Response:", responseData);

      const actions = responseData?.actions || [];
      const parameterActions = actions.find(
        (action) => action['_class'] === 'hudson.model.ParametersDefinitionProperty'
      );

      if (!parameterActions) {
        console.warn("No matching action found.");
        return { ok: false, error: "No matching action found." };
      }

      const params = parameterActions.parameterDefinitions || [];
      const extensibleParams = params.find(
        (param) =>
          param['_class'] ===
          'jp.ikedam.jenkins.plugins.extensible_choice_parameter.ExtensibleChoiceParameterDefinition'
      );

      if (!extensibleParams) {
        console.warn("No extensible parameters found.");
        return { ok: false, error: "No extensible parameters found." };
      }

      const choices = extensibleParams.choices || [];

      // Optimized mapping and filtering in one go
      const mappedChoices = choices.reduce((acc, name) => {
        if (name) {
          acc.push({ value: name, label: name });
        }
        return acc;
      }, []);

      console.log("Mapped Choices:", mappedChoices);
      return { ok: true, data: mappedChoices };

    } catch (error) {
      console.error("API Error:", error);
      return { ok: false, error: error.message };
    }
  });
};
