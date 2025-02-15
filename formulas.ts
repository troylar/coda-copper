import * as coda from "@codahq/packs-sdk";
import * as constants from "./constants";
import * as types from "./types";
import * as helpers from "./helpers";
import * as schemas from "./schemas";

/* -------------------------------------------------------------------------- */
/*                            Sync Table Functions                            */
/* -------------------------------------------------------------------------- */

export async function syncOpportunities(context: coda.SyncExecutionContext) {
  // If there is a previous continuation, grab its page number. Otherwise,
  // start at page 1.
  let pageNumber: number =
    (context.sync.continuation?.pageNumber as number) || 1;

  // Get a page of results, as well as all the background info we'll need to enrich
  // the records we get back from the Copper API
  const [
    response, // page of results from Copper API
    users, // Copper users who might be "assignees"
    copperAccount, // account ID, for building Copper URLs
    pipelines,
    customerSources,
    lossReasons,
    customFieldDefinitions,
  ] = await Promise.all([
    helpers.callApi(context, "opportunities/search", "POST", {
      page_size: constants.PAGE_SIZE,
      page_number: pageNumber,
      sort_by: "date_created",
      sort_direction: "desc",
      // A feature of the Copper API that makes it simpler to manage certain custom
      // field types like select list.
      custom_field_computed_values: true,
    }),
    helpers.getCopperUsers(context),
    helpers.callApiBasicCached(context, "account"),
    helpers.callApiBasicCached(context, "pipelines"),
    helpers.callApiBasicCached(context, "customer_sources"),
    helpers.callApiBasicCached(context, "loss_reasons"),
    helpers.callApiBasicCached(context, "custom_field_definitions"),
  ]);

  // Process the results
  let opportunities: types.OpportunityApiResponse[] = response.body.map(
    (opportunity: types.OpportunityApiResponse) =>
      helpers.enrichOpportunityResponse(
        opportunity,
        copperAccount.id,
        users,
        pipelines,
        customerSources,
        lossReasons,
        customFieldDefinitions,
        true // include references to Person and Company sync tables
      )
  );

  // If we got a full page of results, that means there are probably more results
  // on the next page. Set up a continuation to grab the next page if so.
  let nextContinuation;
  if (opportunities.length == constants.PAGE_SIZE)
    nextContinuation = { pageNumber: pageNumber + 1 };

  return {
    result: opportunities,
    continuation: nextContinuation,
  };
}

export async function syncCompanies(context: coda.SyncExecutionContext) {
  // If there is a previous continuation, grab its page number. Otherwise,
  // start at page 1.
  let pageNumber: number =
    (context.sync.continuation?.pageNumber as number) || 1;

  // Get a page of results, the Copper account info we'll need for building URLs,
  // the list of users who might be "assignees", and any custom fields
  const [response, copperAccount, users, customFieldDefinitions] =
    await Promise.all([
      helpers.callApi(context, "companies/search", "POST", {
        page_size: constants.PAGE_SIZE,
        page_number: pageNumber,
        sort_by: "name",
        custom_field_computed_values: true,
      }),
      helpers.callApiBasicCached(context, "account"),
      helpers.getCopperUsers(context),
      helpers.callApiBasicCached(context, "custom_field_definitions"),
    ]);

  // Process the results by passing each company to the enrichment function
  let companies: types.CompanyApiResponse[] = response.body.map(
    (company: types.CompanyApiResponse) =>
      helpers.enrichCompanyResponse(
        company,
        copperAccount.id,
        users,
        customFieldDefinitions
      )
  );

  // If we got a full page of results, that means there are probably more results
  // on the next page. Set up a continuation to grab the next page if so.
  let nextContinuation;
  if (companies.length == constants.PAGE_SIZE)
    nextContinuation = { pageNumber: pageNumber + 1 };

  return {
    result: companies,
    continuation: nextContinuation,
  };
}

export async function syncPeople(context: coda.SyncExecutionContext) {
  // If there is a previous continuation, grab its page number. Otherwise,
  // start at page 1.
  let pageNumber: number =
    (context.sync.continuation?.pageNumber as number) || 1;

  // Get a page of results, as well as all the background info we'll need to enrich
  // the records we get back from the Copper API
  const [response, users, copperAccount, contactTypes, customFieldDefinitions] =
    await Promise.all([
      helpers.callApi(context, "people/search", "POST", {
        page_size: constants.PAGE_SIZE,
        page_number: pageNumber,
        sort_by: "name",
        custom_field_computed_values: true,
      }),
      helpers.getCopperUsers(context),
      helpers.callApiBasicCached(context, "account"),
      helpers.callApiBasicCached(context, "contact_types"),
      helpers.callApiBasicCached(context, "custom_field_definitions"),
    ]);

  // Process the results by sending each person to the enrichment function
  let people = response.body.map((person) =>
    helpers.enrichPersonResponse(
      person,
      copperAccount.id,
      users,
      contactTypes,
      customFieldDefinitions
    )
  );

  // If we got a full page of results, that means there are probably more results
  // on the next page. Set up a continuation to grab the next page if so.
  let nextContinuation;
  if (people.length == constants.PAGE_SIZE)
    nextContinuation = { pageNumber: pageNumber + 1 };

  return {
    result: people,
    continuation: nextContinuation,
  };
}

export async function syncLeads(context: coda.SyncExecutionContext) {
  // If there is a previous continuation, grab its page number. Otherwise,
  // start at page 1.
  let pageNumber: number =
    (context.sync.continuation?.pageNumber as number) || 1;

  // Get a page of results, as well as all the background info we'll need to enrich
  // the records we get back from the Copper API
  const [response, users, copperAccount, contactTypes, customFieldDefinitions] =
    await Promise.all([
      helpers.callApi(context, "leads/search", "POST", {
        page_size: constants.PAGE_SIZE,
        page_number: pageNumber,
        sort_by: "name",
        custom_field_computed_values: true,
      }),
      helpers.getCopperUsers(context),
      helpers.callApiBasicCached(context, "account"),
      helpers.callApiBasicCached(context, "contact_types"),
      helpers.callApiBasicCached(context, "custom_field_definitions"),
    ]);

  // Process the results by sending each person to the enrichment function
  let leads = response.body.map((lead) =>
    helpers.enrichLeadResponse(
      lead,
      copperAccount.id,
      users,
      contactTypes,
      customFieldDefinitions
    )
  );

  // If we got a full page of results, that means there are probably more results
  // on the next page. Set up a continuation to grab the next page if so.
  let nextContinuation;
  if (leads.length == constants.PAGE_SIZE)
    nextContinuation = { pageNumber: pageNumber + 1 };

  return {
    result: leads,
    continuation: nextContinuation,
  };
}

export async function syncActivityTypes(context: coda.SyncExecutionContext) {
  // If there is a previous continuation, grab its page number. Otherwise,
  // start at page 1.
  let pageNumber: number =
    (context.sync.continuation?.pageNumber as number) || 1;

  // Get a page of results, as well as all the background info we'll need to enrich
  // the records we get back from the Copper API
  const [response] = await Promise.all([
    helpers.callApi(context, "activity_types", "GET", {
      page_size: constants.PAGE_SIZE,
      page_number: pageNumber,
      sort_by: "name",
      custom_field_computed_values: true,
    }),
  ]);

  // Enrich activity types with their type
  const enrichedUserActivityTypes = response.body.user.map((activityType) => {
    return helpers.enrichActivityTypeResponse(activityType, "user");
  });

  const enrichedSystemActivityTypes = response.body.system.map(
    (activityType) => {
      return helpers.enrichActivityTypeResponse(activityType, "system");
    }
  );

  // Combine enriched user and system activity types
  const allActivityTypes = [
    ...enrichedUserActivityTypes,
    ...enrichedSystemActivityTypes,
  ];

  // If we got a full page of results, that means there are probably more results
  // on the next page. Set up a continuation to grab the next page if so.
  let nextContinuation;
  if (allActivityTypes.length == constants.PAGE_SIZE)
    nextContinuation = { pageNumber: pageNumber + 1 };

  return {
    result: allActivityTypes,
    continuation: nextContinuation,
  };
}

/* -------------------------------------------------------------------------- */
/*                               Getter Formulas                              */
/* -------------------------------------------------------------------------- */

export async function getOpportunity(
  context: coda.ExecutionContext,
  urlOrId: string
) {
  // Determine whether the user supplied an ID or a full URL, and extract the ID
  const opportunityId = helpers.getIdFromUrlOrId(urlOrId as string);
  // If we know the record type, and it's the wrong type, throw an error.
  // We'll only know the type if the user supplied a URL though (not when they just
  // supplied an ID)
  helpers.checkRecordIdType(opportunityId.type, "opportunity");
  // Get the opportunity, as well as all the background info we'll need to enrich
  // the records we get back from the Copper API
  const [
    response, // opportunity record from Copper API
    users, // Copper users who might be "assignees"
    copperAccount, // for building Copper URLs
    pipelines,
    customerSources,
    lossReasons,
  ] = await Promise.all([
    helpers.callApi(context, "opportunities/" + opportunityId.id, "GET", {
      custom_field_computed_values: true,
    }),
    helpers.getCopperUsers(context),
    helpers.callApiBasicCached(context, "account"),
    helpers.callApiBasicCached(context, "pipelines"),
    helpers.callApiBasicCached(context, "customer_sources"),
    helpers.callApiBasicCached(context, "loss_reasons"),
  ]);

  let opportunity = await helpers.enrichOpportunityResponse(
    response.body,
    copperAccount.id,
    users,
    pipelines,
    customerSources,
    lossReasons,
    undefined, // we can't do custom fields on regular formulas, cause of static schema
    false // don't include references to Person and Company sync tables
  );

  return opportunity;
}

export async function getPerson(
  context: coda.ExecutionContext,
  urlOrId: string
) {
  const opportunityId = helpers.getIdFromUrlOrId(urlOrId as string);
  helpers.checkRecordIdType(opportunityId.type, "person");
  // Get the person, as well as all the background info we'll need to enrich
  // the records we get back from the Copper API
  const [
    response, // opportunity record from Copper API
    users, // Copper users who might be "assignees"
    copperAccount, // for building Copper URLs
    contactTypes,
  ] = await Promise.all([
    helpers.callApi(context, "people/" + opportunityId.id, "GET", {
      custom_field_computed_values: true,
    }),
    helpers.getCopperUsers(context),
    helpers.callApiBasicCached(context, "account"),
    helpers.callApiBasicCached(context, "contact_types"),
  ]);

  let person = await helpers.enrichPersonResponse(
    response.body,
    copperAccount.id,
    users,
    contactTypes
  );

  return person;
}

export async function getCompany(
  context: coda.ExecutionContext,
  urlOrId: string
) {
  // Determine whether the user supplied an ID or a full URL, and extract the ID
  const opportunityId = helpers.getIdFromUrlOrId(urlOrId as string);
  helpers.checkRecordIdType(opportunityId.type, "company");
  // Get the company, as well as all the background info we'll need to enrich
  // the records we get back from the Copper API
  const [
    response, // opportunity record from Copper API
    users, // Copper users who might be "assignees"
    copperAccount, // for building Copper URLs
  ] = await Promise.all([
    helpers.callApi(context, "companies/" + opportunityId.id, "GET", {
      custom_field_computed_values: true,
    }),
    helpers.getCopperUsers(context),
    helpers.callApiBasicCached(context, "account"),
  ]);

  let company = await helpers.enrichCompanyResponse(
    response.body,
    copperAccount.id,
    users
  );

  return company;
}

export async function syncProjects(context: coda.SyncExecutionContext) {
  // If there is a previous continuation, grab its page number. Otherwise,
  // start at page 1.
  let pageNumber: number =
    (context.sync.continuation?.pageNumber as number) || 1;

  // Get a page of results, as well as all the background info we'll need to enrich
  // the records we get back from the Copper API
  const [
    response,
    users,
    copperAccount,
    customFieldDefinitions,
    opportunities,
    companies,
  ] = await Promise.all([
    helpers.callApi(context, "projects/search", "POST", { page_size: 200 }),
    helpers.getCopperUsers(context),
    helpers.callApiBasicCached(context, "account"),
    helpers.callApiBasicCached(context, "custom_field_definitions"),
    helpers.callApiBasicCached(context, "opportunities"),
    helpers.callApiBasicCached(context, "companies"),
  ]);

  // Process the results by sending each project to the enrichment function
  let projects = response.body.map((project) =>
    helpers.enrichProjectResponse(
      project,
      copperAccount.id,
      users,
      opportunities,
      companies,
      customFieldDefinitions
    )
  );

  // If we got a full page of results, that means there are probably more results
  // on the next page. Set up a continuation to grab the next page if so.
  let nextContinuation;
  console.log("Projects length: " + projects.length);
  if (projects.length == constants.PAGE_SIZE)
    nextContinuation = { pageNumber: pageNumber + 1 };

  return {
    result: projects,
    continuation: nextContinuation,
  };
}

/* -------------------------------------------------------------------------- */
/*                               Action Formulas                              */
/* -------------------------------------------------------------------------- */

export async function updateOpportunityStatus(
  context: coda.ExecutionContext,
  urlOrId: string,
  newStatus: string,
  lossReason?: string // if changing the status to lost, accept a loss reason
) {
  // Determine whether the user supplied an ID or a full URL, and extract the ID
  const opportunityId = helpers.getIdFromUrlOrId(urlOrId);
  // Make sure it's the correct type of record
  helpers.checkRecordIdType(opportunityId.type, "opportunity");
  // Make sure the new status is valid
  newStatus = helpers.initialCapital(newStatus);
  if (!constants.STATUS_OPTIONS.includes(newStatus)) {
    throw new coda.UserVisibleError(
      "New status must be " +
        helpers.humanReadableList(constants.STATUS_OPTIONS)
    );
  }

  // Prepare the payload, including loss reason if appropriate
  let payload: any = {
    status: newStatus,
  };
  if (lossReason && newStatus === "Lost") {
    // Get the list of loss reasons defined in Copper
    let lossReasons = await helpers.callApiBasicCached(context, "loss_reasons");
    // Is the new reason in our list of loss reasons? Grab it (including its ID) if so
    let lossReasonObject = lossReasons.find(
      (reason) => reason.name === lossReason
    );
    if (lossReasonObject) {
      payload.loss_reason_id = lossReasonObject.id as string;
    } else {
      // We didn't find a match for the provided loss reason; tell user what their options are
      throw new coda.UserVisibleError(
        "Loss reason must be " +
          helpers.humanReadableList(lossReasons.map(({ name }) => name))
      );
    }
  }

  // Update the status (the API will respond with the updated opportunity, so
  // we'll hang onto that too)
  let response = await helpers.callApi(
    context,
    "opportunities/" + opportunityId.id,
    "PUT",
    {
      ...payload,
      custom_field_computed_values: true,
    }
  );

  return await helpers.enrichOpportunityResponseWithFetches(
    context,
    response.body
  );
}

export async function updateOpportunityStage(
  context: coda.ExecutionContext,
  urlOrId: string,
  newStageName: string
) {
  const opportunityId = helpers.getIdFromUrlOrId(urlOrId);
  helpers.checkRecordIdType(opportunityId.type, "opportunity");

  // Get opportunity details and pipelines (which include lists of stages in each pipeline)
  let [existingResponse, pipelines] = await Promise.all([
    helpers.callApi(context, "opportunities/" + opportunityId.id, "GET"),
    helpers.callApiBasicCached(context, "pipelines"),
  ]);
  let opportunity = existingResponse.body;

  // Grab the pipeline associated with the opportunity
  let pipeline = pipelines.find(
    (pipeline) => pipeline.id === (opportunity.pipeline_id as string)
  );

  // Grab the stage that matches the requested stage name
  let newStage = pipeline.stages.find(
    (stage) => stage.name.toLowerCase() === newStageName.toLowerCase()
  );
  if (!newStage) {
    throw new coda.UserVisibleError(
      "Stage must be " +
        helpers.humanReadableList(pipeline.stages.map(({ name }) => name))
    );
  }

  // Update the stage
  let response = await helpers.callApi(
    context,
    "opportunities/" + opportunityId.id,
    "PUT",
    {
      pipeline_stage_id: newStage.id,
      custom_field_computed_values: true,
    }
  );
  return await helpers.enrichOpportunityResponseWithFetches(
    context,
    response.body
  );
}

export async function renameOpportunity(
  context: coda.ExecutionContext,
  urlOrId: string,
  newName: string
) {
  if (!newName)
    throw new coda.UserVisibleError("New opportunity name cannot be blank");

  const opportunityId = helpers.getIdFromUrlOrId(urlOrId);
  helpers.checkRecordIdType(opportunityId.type, "opportunity");

  let response = await helpers.callApi(
    context,
    "opportunities/" + opportunityId.id,
    "PUT",
    { name: newName, custom_field_computed_values: true }
  );
  return await helpers.enrichOpportunityResponseWithFetches(
    context,
    response.body
  );
}

export async function assignRecord(
  context: coda.ExecutionContext,
  recordType: "opportunity" | "person" | "company",
  urlOrId: string,
  assigneeEmail: string
) {
  // Determine whether the user supplied an ID or a full URL, and extract the ID
  const recordId = helpers.getIdFromUrlOrId(urlOrId);
  // Make sure it's the correct type of record
  helpers.checkRecordIdType(recordId.type, recordType);
  // Make sure the assignee exists in the Copper system
  let users: types.CopperUserApiResponse[] = await helpers.getCopperUsers(
    context
  );
  let assigneeUser = users.find((user) => user.email === assigneeEmail);
  if (!assigneeUser) {
    throw new coda.UserVisibleError(
      `Couldn't find a Copper user with the email address "${assigneeEmail}". Try ${helpers.humanReadableList(
        users.map(({ email }) => email)
      )}.`
    );
  }
  // Prepare the payload
  let payload = {
    assignee_id: assigneeUser.id,
  };
  // Prepare the API endpoint string
  let endpoint = helpers.getRecordApiEndpoint(recordType, recordId.id);
  // Update the record (the API will respond with the updated record, so
  // we'll hang onto that too)
  let response = await helpers.callApi(context, endpoint, "PUT", {
    ...payload,
    custom_field_computed_values: true,
  });
  // Enrich the updated record and prepare it for insertion back into the sync table
  return await helpers.enrichResponseWithFetches(
    context,
    recordType,
    response.body
  );
}

export async function addOrRemoveTag(
  context: coda.ExecutionContext,
  recordType: "opportunity" | "person" | "company",
  urlOrId: string,
  tag: string,
  remove = false // if true, remove the tag instead of adding it
) {
  const recordId = helpers.getIdFromUrlOrId(urlOrId);
  helpers.checkRecordIdType(recordId.type, recordType);

  let endpoint = helpers.getRecordApiEndpoint(recordType, recordId.id);

  let existingResponse = await helpers.callApi(
    context,
    endpoint,
    "GET",
    undefined,
    0
  );
  let tags: string[] = existingResponse.body.tags;

  if (remove) {
    tags = tags.filter((candidateTag) => candidateTag !== tag);
  } else {
    tags.push(tag);
  }

  let response = await helpers.callApi(context, endpoint, "PUT", {
    tags: tags,
    custom_field_computed_values: true,
  });
  return await helpers.enrichResponseWithFetches(
    context,
    recordType,
    response.body
  );
}

export async function updateCustomField(
  context: coda.ExecutionContext,
  recordType: "opportunity" | "person" | "company",
  urlOrId: string,
  fieldName: string,
  newValue: string
) {
  const recordId = helpers.getIdFromUrlOrId(urlOrId);
  helpers.checkRecordIdType(recordId.type, recordType);

  // Get the existing record, as well as the list of custom fields
  let endpoint = helpers.getRecordApiEndpoint(recordType, recordId.id);
  let [record, allCustomFieldDefinitions] = await Promise.all([
    helpers.callApi(context, endpoint, "GET").then((response) => response.body),
    helpers.callApiBasicCached(context, "custom_field_definitions"),
  ]);

  // Grab just the custom fields that are relevant to this record type
  let customFieldDefinitions = allCustomFieldDefinitions.filter((fieldDef) =>
    fieldDef.available_on.includes(recordType)
  );

  // Get the details of the custom field we're updating
  let targetFieldDefinition = customFieldDefinitions.find(
    (fieldDef) =>
      helpers.stripAndLowercase(fieldDef.name) ===
      helpers.stripAndLowercase(fieldName)
  );

  // If we didn't find a matching field, throw an error
  if (!targetFieldDefinition)
    throw new coda.UserVisibleError(
      `Couldn't find a custom field called "${fieldName}" for this record type. Try ${helpers.humanReadableList(
        customFieldDefinitions.map(({ name }) => name)
      )}.`
    );

  // Prepare the value in the way that Copper is expecting. For simple field types
  // like strings, numbers or booleans, we can just pass the value straight through.
  // But others require format conversion (e.g. dates), or an ID-based lookup
  // (e.g. dropdown). Note that field types Connect and MultiSelect are not
  // currently supported in the pack. See Copper API docs for full field type list:
  // https://developer.copper.com/custom-fields/general/list-custom-field-definitions.html
  let newPreparedValue;
  switch (targetFieldDefinition.data_type) {
    case "Date":
      // Send the date in seconds since epoch (not ms as JavaScript does by default)
      try {
        newPreparedValue = Math.round(new Date(newValue).getTime() / 1000);
      } catch (e) {
        throw new coda.UserVisibleError(
          `Couldn't parse date "${newValue}". Please use the format "YYYY-MM-DD".`
        );
      }
      break;
    case "Dropdown":
      // Dropdowns require us to send the ID of the selected option, not its name
      newPreparedValue = targetFieldDefinition.options.find(
        (option) =>
          helpers.stripAndLowercase(option.name) ===
          helpers.stripAndLowercase(newValue)
      )?.id;
      if (!newPreparedValue)
        throw new coda.UserVisibleError(
          `${newValue} is not an option for the custom field "${fieldName}". Try ${helpers.humanReadableList(
            targetFieldDefinition.options.map(({ name }) => name)
          )}.`
        );
      break;
    default:
      newPreparedValue = newValue;
  }

  // Start with existing custom field values, and modify the requested one
  let customFieldValues = record.custom_fields;
  customFieldValues.find(
    (field: types.CustomFieldApiProperty) =>
      field.custom_field_definition_id === targetFieldDefinition.id
  ).value = newPreparedValue;

  // Update on the API
  let response = await helpers.callApi(context, endpoint, "PUT", {
    custom_fields: customFieldValues,
    custom_field_computed_values: true,
  });
  return await helpers.enrichResponseWithFetches(
    context,
    recordType,
    response.body
  );
}

/* -------------------------------------------------------------------------- */
/*                                Autocomplete                                */
/* -------------------------------------------------------------------------- */

export async function autocompleteLossReasons(
  context: coda.ExecutionContext
): Promise<string[]> {
  let response = await helpers.callApiBasicCached(context, "loss_reasons");
  return response.map((reason) => reason.name);
}

export async function autocompleteUsers(
  context: coda.ExecutionContext
): Promise<string[]> {
  let response = await helpers.getCopperUsers(context);
  return response.map((user) => user.email);
}

export async function autocompletePipelineStages(
  context: coda.ExecutionContext,
  urlOrId: string
): Promise<string[]> {
  const opportunityId = helpers.getIdFromUrlOrId(urlOrId);
  helpers.checkRecordIdType(opportunityId.type, "opportunity");
  let endpoint = helpers.getRecordApiEndpoint("opportunity", opportunityId.id);
  let [existingResponse, pipelines] = await Promise.all([
    helpers.callApi(context, endpoint, "GET"),
    helpers.callApiBasicCached(context, "pipelines"),
  ]);
  let opportunity = existingResponse.body;
  return pipelines
    .find(
      (pipeline) =>
        (pipeline.id as string) === (opportunity.pipeline_id as string)
    )
    .stages.map((stage) => stage.name);
}

export async function autocompleteCustomFields(
  context: coda.ExecutionContext,
  recordType: "opportunity" | "person" | "company"
): Promise<string[]> {
  let response = await helpers.callApiBasicCached(
    context,
    "custom_field_definitions"
  );
  return response
    .filter((fieldDef) => fieldDef.available_on.includes(recordType))
    .map((fieldDef) => fieldDef.name);
}
