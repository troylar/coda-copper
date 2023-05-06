import * as coda from "@codahq/packs-sdk";
import * as helpers from "./helpers";

/* -------------------------------------------------------------------------- */
/*                            Common object schemas                           */
/* -------------------------------------------------------------------------- */

const CopperUserSchema = coda.makeObjectSchema({
  codaType: coda.ValueHintType.Person,
  properties: {
    email: {
      type: coda.ValueType.String,
      required: true,
    },
    name: { type: coda.ValueType.String },
    copperUserId: { type: coda.ValueType.String },
  },
  displayProperty: "name",
  idProperty: "email",
});

const PhoneNumberSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  displayProperty: "number",
  idProperty: "number",
  properties: {
    number: {
      type: coda.ValueType.String,
      description: "Phone number",
    },
    category: {
      type: coda.ValueType.String,
      description: "Phone number category",
    },
  },
});

const EmailAddressSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  displayProperty: "email",
  idProperty: "email",
  properties: {
    email: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Email,
      description: "Email address",
    },
    category: {
      type: coda.ValueType.String,
      description: "Email category",
    },
  },
});

const SocialSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  displayProperty: "category",
  idProperty: "url",
  properties: {
    url: {
      type: coda.ValueType.String,
      description: "Social media URL",
      codaType: coda.ValueHintType.Url,
    },
    category: {
      type: coda.ValueType.String,
      description: "Social media category",
    },
  },
});

const WebsiteSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  displayProperty: "url",
  idProperty: "url",
  properties: {
    url: {
      type: coda.ValueType.String,
      description: "Website URL",
      codaType: coda.ValueHintType.Url,
    },
    category: {
      type: coda.ValueType.String,
      description: "Website category",
    },
  },
});

/* -------------------------------------------------------------------------- */
/*                             Sync table schemas                             */
/* -------------------------------------------------------------------------- */

export const CompanySchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  idProperty: "companyId",
  displayProperty: "companyName",
  featuredProperties: ["fullAddress", "copperUrl", "websites"],
  identity: { name: "Company" },
  includeUnknownProperties: true,
  properties: {
    companyName: {
      type: coda.ValueType.String,
      description: "Company name",
      required: true,
      fromKey: "name",
    },
    fullAddress: {
      // synthetic address property (combining all address fields)
      type: coda.ValueType.String,
      description: "Company address",
    },
    assignee: CopperUserSchema,
    tags: {
      type: coda.ValueType.Array,
      description: "Tags",
      items: coda.makeSchema({
        type: coda.ValueType.String,
      }),
    },
    copperUrl: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
      description: "View Company on Copper",
      fromKey: "url",
    },
    details: {
      type: coda.ValueType.String,
      description: "Company details",
    },
    phoneNumbers: {
      type: coda.ValueType.Array,
      description: "Phone numbers",
      fromKey: "phone_numbers",
      items: PhoneNumberSchema,
    },
    emailDomain: {
      type: coda.ValueType.String,
      description: "Email domain",
      fromKey: "email_domain",
    },
    interactionCount: {
      type: coda.ValueType.Number,
      description: "Number of interactions with this company",
      fromKey: "interaction_count",
    },
    socials: {
      type: coda.ValueType.Array,
      description: "Social media links",
      items: SocialSchema,
    },
    websites: {
      type: coda.ValueType.Array,
      description: "Websites",
      items: WebsiteSchema,
    },
    street: {
      type: coda.ValueType.String,
      description: "Address: street",
      fromKey: "address.street",
    },
    city: {
      type: coda.ValueType.String,
      description: "Address: city",
      fromKey: "address.city",
    },
    state: {
      type: coda.ValueType.String,
      description: "Address: state",
      fromKey: "address.state",
    },
    postalCode: {
      type: coda.ValueType.String,
      description: "Address: postal code",
      fromKey: "address.postal_code",
    },
    country: {
      type: coda.ValueType.String,
      description: "Address: country",
      fromKey: "address.country",
    },
    dateCreated: {
      type: coda.ValueType.Number,
      codaType: coda.ValueHintType.Date,
      description: "Date created",
      fromKey: "date_created",
    },
    dateModified: {
      type: coda.ValueType.Number,
      codaType: coda.ValueHintType.Date,
      description: "Date modified",
      fromKey: "date_modified",
    },
    contactTypeId: {
      type: coda.ValueType.String,
      description: "Contact type ID on Copper",
      fromKey: "contact_type_id",
    },
    assigneeId: {
      type: coda.ValueType.String,
      description: "Assignee ID on Copper",
      fromKey: "assignee_id",
    },
    companyId: {
      type: coda.ValueType.String,
      description: "Company ID on Copper",
      required: true,
      fromKey: "id",
    },
  },
});

export const CompanyReferenceSchema =
  coda.makeReferenceSchemaFromObjectSchema(CompanySchema);

export const PersonSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  idProperty: "personId",
  displayProperty: "fullName",
  featuredProperties: [
    "title",
    "company",
    "primaryEmail",
    "assignee",
    "copperUrl",
  ],
  identity: { name: "Person" },
  includeUnknownProperties: true,
  properties: {
    fullName: {
      type: coda.ValueType.String,
      description: "Person name",
      required: true,
      fromKey: "name",
    },
    title: {
      type: coda.ValueType.String,
      description: "Title",
    },
    company: CompanyReferenceSchema,
    assignee: CopperUserSchema,
    copperUrl: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
      description: "View Person on Copper",
      fromKey: "url",
    },
    tags: {
      type: coda.ValueType.Array,
      description: "Tags",
      items: coda.makeSchema({
        type: coda.ValueType.String,
      }),
    },
    contactType: {
      type: coda.ValueType.String,
      description: "Type of contact",
    },
    fullAddress: {
      // synthetic address property (combining all address fields)
      type: coda.ValueType.String,
      description: "Full address",
    },
    details: {
      type: coda.ValueType.String,
      description: "Details",
    },
    primaryEmail: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Email,
      description: "Primary email",
    },
    emails: {
      type: coda.ValueType.Array,
      description: "Email addresses",
      items: EmailAddressSchema,
    },
    phoneNumbers: {
      type: coda.ValueType.Array,
      description: "Phone numbers",
      items: PhoneNumberSchema,
    },
    socials: {
      type: coda.ValueType.Array,
      description: "Social media links",
      items: SocialSchema,
    },
    websites: {
      type: coda.ValueType.Array,
      description: "Websites",
      items: WebsiteSchema,
    },
    prefix: {
      type: coda.ValueType.String,
      description: "Prefix",
    },
    firstName: {
      type: coda.ValueType.String,
      description: "First name",
      fromKey: "first_name",
    },
    middleName: {
      type: coda.ValueType.String,
      description: "Middle name",
      fromKey: "middle_name",
    },
    lastName: {
      type: coda.ValueType.String,
      description: "Last name",
      fromKey: "last_name",
    },
    suffix: {
      type: coda.ValueType.String,
      description: "Name suffix",
    },
    street: {
      type: coda.ValueType.String,
      description: "Address: street",
      fromKey: "address.street",
    },
    city: {
      type: coda.ValueType.String,
      description: "Address: city",
      fromKey: "address.city",
    },
    state: {
      type: coda.ValueType.String,
      description: "Address: state",
      fromKey: "address.state",
    },
    postalCode: {
      type: coda.ValueType.String,
      description: "Address: postal code",
      fromKey: "address.postal_code",
    },
    country: {
      type: coda.ValueType.String,
      description: "Address: country",
      fromKey: "address.country",
    },
    interactionCount: {
      type: coda.ValueType.Number,
      description: "Number of interactions with this person",
      fromKey: "interaction_count",
    },
    dateCreated: {
      type: coda.ValueType.Number,
      codaType: coda.ValueHintType.Date,
      description: "Date created",
      fromKey: "date_created",
    },
    dateModified: {
      type: coda.ValueType.Number,
      codaType: coda.ValueHintType.Date,
      description: "Date modified",
      fromKey: "date_modified",
    },
    personId: {
      type: coda.ValueType.String,
      description: "Person ID on Copper",
      required: true,
      fromKey: "id",
    },
  },
});

export const ActivityTypeSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  idProperty: "id",
  displayProperty: "name",
  properties: {
    id: { type: coda.ValueType.Number, required: true },
    category: { type: coda.ValueType.String, required: true },
    name: { type: coda.ValueType.String, required: true },
    is_disabled: { type: coda.ValueType.Boolean },
    count_as_interaction: { type: coda.ValueType.Boolean },
  },
  identity: {
    name: "ActivityType",
    id: "id",
  },
});

export const LeadSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  idProperty: "id",
  displayProperty: "name",
  featuredProperties: ["email", "phone", "status"],
  identity: { name: "Lead" },
  includeUnknownProperties: true,
  properties: {
    id: {
      type: coda.ValueType.String,
      description: "Unique identifier for the Lead",
      required: true,
    },
    name: {
      type: coda.ValueType.String,
      description: "The name of the Lead",
      required: true,
    },
    email: {
      type: coda.ValueType.String,
      description: "The email address of the Lead",
    },
    phone: {
      type: coda.ValueType.String,
      description: "The phone number of the Lead",
    },
    status: {
      type: coda.ValueType.String,
      description: "The status of the Lead",
    },
    source: {
      type: coda.ValueType.String,
      description: "The source of the Lead",
    },
    date_created: {
      type: coda.ValueType.Number,
      description:
        "A Unix timestamp representing the time at which this Lead was created",
    },
    date_modified: {
      type: coda.ValueType.Number,
      description:
        "A Unix timestamp representing the time at which this Lead was last modified",
    },
  },
});

export const PersonReferenceSchema =
  coda.makeReferenceSchemaFromObjectSchema(PersonSchema);

export const LeadReferenceSchema =
  coda.makeReferenceSchemaFromObjectSchema(LeadSchema);

export const OpportunitySchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  idProperty: "opportunityId",
  displayProperty: "opportunityName",
  featuredProperties: [
    "company",
    "primaryContact",
    "status",
    "monetaryValue",
    "copperUrl",
  ],
  identity: { name: "Opportunity" },
  includeUnknownProperties: true,
  properties: {
    opportunityName: {
      type: coda.ValueType.String,
      description: "Name of the opportunity",
      fromKey: "name",
    },
    primaryContact: PersonReferenceSchema,
    company: CompanyReferenceSchema,
    status: {
      type: coda.ValueType.String,
      description: "Status of the opportunity",
    },
    assignee: CopperUserSchema,
    pipelineStage: {
      type: coda.ValueType.String,
      description: "Stage of the pipeline that the opportunity is in",
    },
    closeDate: {
      // for some reason this is a MM/DD/YYYY or DD/MM/YYYY string, while others are unix epoch
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Date,
      description: "Close date of the opportunity",
      fromKey: "close_date",
    },
    monetaryValue: {
      type: coda.ValueType.Number,
      codaType: coda.ValueHintType.Currency,
      description: "Expected value of the opportunity",
      fromKey: "monetary_value",
    },
    copperUrl: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
      description: "View Opportunity on Copper",
      fromKey: "url",
    },
    priority: {
      type: coda.ValueType.String,
      description: "Priority of the opportunity (None, Low, Medium, High)",
    },
    tags: {
      type: coda.ValueType.Array,
      items: coda.makeSchema({
        type: coda.ValueType.String,
      }),
      description: "Opportunity tags",
    },
    customerSource: {
      type: coda.ValueType.String,
      description: "Customer source",
    },
    details: {
      type: coda.ValueType.String,
      description: "Opportunity details",
    },
    lossReason: {
      type: coda.ValueType.String,
      description: "The reason for losing the opportunity",
    },
    pipeline: {
      type: coda.ValueType.String,
      description: "The pipeline the opportunity belongs to",
    },
    interactionCount: {
      type: coda.ValueType.Number,
      description: "Number of interactions related to this opportunity",
      fromKey: "interaction_count",
    },
    winProbability: {
      type: coda.ValueType.Number,
      description: "Probability of winning",
      fromKey: "win_probability",
    },
    dateLastContacted: {
      type: coda.ValueType.Number,
      codaType: coda.ValueHintType.Date,
      description: "Date of last contact",
      fromKey: "date_last_contacted",
    },
    // leadsConvertedFrom: {
    //   type: coda.ValueType.Array,
    //   items: coda.makeSchema({
    //     type: coda.ValueType.String
    //   }),
    //   description: "Leads the opportunity was converted from",
    // },
    // dateLeadCreated: {
    //   type: coda.ValueType.Number,
    //   codaType: coda.ValueHintType.Date,
    //   description: "Date the lead was created on",
    //   fromKey: "date_lead_created",
    // },
    dateCreated: {
      type: coda.ValueType.Number,
      codaType: coda.ValueHintType.Date,
      description: "Date the opportunity was created on",
      fromKey: "date_created",
    },
    dateModified: {
      type: coda.ValueType.Number,
      codaType: coda.ValueHintType.Date,
      description: "Date the opportunity was last modified on",
      fromKey: "date_modified",
    },
    primaryContactId: {
      type: coda.ValueType.String,
      description: "Primary customer contact ID",
      fromKey: "primary_contact_id",
    },
    assigneeId: {
      type: coda.ValueType.String,
      fromKey: "assignee_id",
    },
    companyId: {
      type: coda.ValueType.String,
      description: "Id of the related company",
      fromKey: "company_id",
    },
    companyName: {
      type: coda.ValueType.String,
      description: "Name of the related company",
      fromKey: "company_name",
    },
    opportunityId: {
      type: coda.ValueType.String,
      description: "Copper ID of the opportunity",
      required: true,
      fromKey: "id",
    },
  },
});

export const ProjectSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  idProperty: "id",
  displayProperty: "name",
  featuredProperties: ["status", "assignee", "company", "opportunity"],
  identity: { name: "Project" },
  includeUnknownProperties: true,
  properties: {
    id: {
      type: coda.ValueType.String,
      description: "Unique identifier for the Project",
      required: true,
    },
    name: {
      type: coda.ValueType.String,
      description: "The name of the Project",
      required: true,
    },
    opportunity: OpportunitySchema,
    company: CompanyReferenceSchema,
    assignee: CopperUserSchema,
    assignee_id: {
      type: coda.ValueType.String,
      description:
        "Unique identifier of the User that will be the owner of the Project",
    },
    status: {
      type: coda.ValueType.String,
      description:
        "The status of the Project. Valid values are: 'Open', 'Completed'",
    },
    details: {
      type: coda.ValueType.String,
      description: "Description of the Project",
    },
    tags: {
      type: coda.ValueType.Array,
      description:
        "An array of the tags associated with the Project, represented as strings",
      items: coda.makeSchema({
        type: coda.ValueType.String,
      }),
    },
    date_created: {
      type: coda.ValueType.Number,
      description:
        "A Unix timestamp representing the time at which this Project was created",
    },
    date_modified: {
      type: coda.ValueType.Number,
      description:
        "A Unix timestamp representing the time at which this Project was last modified",
    },
  },
});

// Define a schema for a Task object
const TaskSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  idProperty: "id",
  displayProperty: "name",
  featuredProperties: [
    "related_resource",
    "assignee_id",
    "due_date",
    "priority",
    "status",
  ],
  identity: { name: "Task" },
  includeUnknownProperties: true,
  properties: {
    id: {
      type: coda.ValueType.String,
      description: "Unique identifier for the Task",
      required: true,
      fromKey: "id",
    },
    name: {
      type: coda.ValueType.String,
      description: "The name of the Task",
      required: true,
      fromKey: "name",
    },
    related_resource: {
      type: coda.ValueType.String,
      description: "The primary related resource for the Task",
      fromKey: "related_resource",
    },
    assignee_id: {
      type: coda.ValueType.String,
      description:
        "Unique identifier of the User that will be the owner of the Task",
      required: true,
      fromKey: "assignee_id",
    },
    due_date: {
      type: coda.ValueType.Number,
      codaType: coda.ValueHintType.Date,
      description: "The date on which the Task is due",
      fromKey: "due_date",
    },
    reminder_date: {
      type: coda.ValueType.Number,
      codaType: coda.ValueHintType.Date,
      description: "The date on which to receive a reminder about the Task",
      fromKey: "reminder_date",
    },
    completed_date: {
      type: coda.ValueType.Number,
      codaType: coda.ValueHintType.Date,
      description:
        "The date on which the Task was completed. This is automatically set when the status changes from Open to Completed, and cannot be set directly.",
      fromKey: "completed_date",
    },
    priority: {
      type: coda.ValueType.String,
      description: "The priority of the Task",
      options: ["None", "High"],
      fromKey: "priority",
    },
    status: {
      type: coda.ValueType.String,
      description: "The status of the Task",
      options: ["Open", "Completed"],
      fromKey: "status",
    },
    details: {
      type: coda.ValueType.String,
      description: "Description of the Task",
      fromKey: "details",
    },
    tags: {
      type: coda.ValueType.Array,
      items: coda.makeSchema({
        type: coda.ValueType.String,
      }),
      description:
        "An array of the tags associated with the Task, represented as strings",
      fromKey: "tags",
    },
    custom_fields: {
      type: coda.ValueType.Array,
      items: coda.makeSchema({
        type: coda.ValueType.Object,
        properties: {
          custom_field_definition_id: {
            type: coda.ValueType.String,
            description:
              "The id of the Custom Field Definition for which this Custom Field stores a value",
            fromKey: "custom_field_definition_id",
          },
          value: {
            type: coda.ValueType.Mixed,
            description:
              "The value (number, string, option id, or timestamp) of this Custom Field",
            fromKey: "value",
          },
        },
      }),
      description: "An array of custom field values belonging to the Task",
      fromKey: "custom_fields",
    },
    date_created: {
      type: coda.ValueType.Number,
      codaType: coda.ValueHintType.Date,
      description:
        "A Unix timestamp representing the time at which this Task was created",
      fromKey: "date_created",
    },
    date_modified: {
      type: coda.ValueType.Number,
      codaType: coda.ValueHintType.Date,
      description:
        "A Unix timestamp representing the time at which this Task was last modified",
      fromKey: "date_modified",
    },
  },
});

const ActivitySchema: coda.Schema = {
  type: coda.ValueType.Object,
  properties: {
    id: {
      type: coda.ValueType.Number,
    },
    parent_type: {
      type: coda.ValueType.String,
    },
    parent: {
      type: coda.ValueType.Object,
      codaType: coda.ValueHintType.Reference,
      formulaNamespace: "activity",
      oneOf: [
        { formulaNamespace: "lead", codaType: coda.ValueHintType.Reference },
        { formulaNamespace: "person", codaType: coda.ValueHintType.Reference },
        { formulaNamespace: "company", codaType: coda.ValueHintType.Reference },
        {
          formulaNamespace: "opportunity",
          codaType: coda.ValueHintType.Reference,
        },
        { formulaNamespace: "project", codaType: coda.ValueHintType.Reference },
        { formulaNamespace: "task", codaType: coda.ValueHintType.Reference },
      ],
    },
    type: {
      type: coda.ValueType.Object,
      properties: {
        id: {
          type: coda.ValueType.Number,
        },
        category: {
          type: coda.ValueType.String,
        },
      },
    },
    user_id: {
      type: coda.ValueType.Number,
    },
    details: {
      type: coda.ValueType.String,
    },
    activity_date: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Date,
    },
    old_value: {
      type: coda.ValueType.String,
    },
    new_value: {
      type: coda.ValueType.String,
    },
    date_created: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Date,
    },
    date_modified: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Date,
    },
  },
  primary: "id",
  featured: ["parent", "type", "user_id", "details"],
  identity: {
    name: "Activity",
    id: "id",
  },
};
/* -------------------------------------------------------------------------- */
/*                         Dynamic Sync Table Schemas                         */
/* -------------------------------------------------------------------------- */

export async function getSchemaWithCustomFields(
  context: coda.ExecutionContext,
  recordType:
    | "person"
    | "company"
    | "opportunity"
    | "project"
    | "lead"
    | "activitytype"
) {
  console.log("Getting schema with custom fields for ", recordType);
  // First, load up the appropriate static schema, which we'll add on to
  let staticSchema: coda.Schema;
  switch (recordType) {
    case "person":
      staticSchema = PersonSchema;
      break;
    case "company":
      staticSchema = CompanySchema;
      break;
    case "opportunity":
      staticSchema = OpportunitySchema;
      break;
    case "project":
      staticSchema = ProjectSchema;
      break;
    case "lead":
      staticSchema = LeadSchema;
      break;
    case "activitytype":
      staticSchema = ActivityTypeSchema;
      break;
    default:
      throw new coda.UserVisibleError(
        "There was an error generating the sync table"
      );
  }

  // Start with the static properties
  let properties: coda.ObjectSchemaProperties = staticSchema.properties;

  // Go get the list of custom fields
  let allCustomFields = await helpers.callApiBasicCached(
    context,
    "custom_field_definitions"
  );

  // Filter to just the custom fields that apply to this record type
  let applicableCustomFields = allCustomFields.filter((customField) =>
    customField.available_on.includes(recordType)
  );

  // Format the custom fields as schema properties, and add them to the schema
  for (let customField of applicableCustomFields) {
    let name = customField.name;
    console.log("Field name:", name);
    let propertySchema;
    // Build appropriate field schemas based on the type of custom field
    // Note: we're not currently fully implementing the "Connect" field type,
    // but could in future given sufficient user demand
    switch (customField.type) {
      case "Url":
        propertySchema = coda.makeSchema({
          type: coda.ValueType.String,
          codaType: coda.ValueHintType.Url,
        });
        break;
      case "Date":
        propertySchema = coda.makeSchema({
          type: coda.ValueType.Number,
          codaType: coda.ValueHintType.Date,
        });
        break;
      case "Checkbox":
        propertySchema = coda.makeSchema({ type: coda.ValueType.Boolean });
        break;
      case "Float":
        propertySchema = coda.makeSchema({ type: coda.ValueType.Number });
        break;
      case "Percentage":
        propertySchema = coda.makeSchema({ type: coda.ValueType.Number });
        break;
      case "Currency":
        propertySchema = coda.makeSchema({
          type: coda.ValueType.Number,
          codaType: coda.ValueHintType.Currency,
        });
        break;
      case "MultiSelect":
        propertySchema = coda.makeSchema({
          type: coda.ValueType.Array,
          items: coda.makeSchema({
            type: coda.ValueType.String,
          }),
        });
        break;
      default:
        // including String, Text, Dropdown, Connect
        propertySchema = coda.makeSchema({ type: coda.ValueType.String });
    }
    // Add the custom field property to the schema
    console.log("Property Schema:", JSON.stringify(propertySchema));
    properties[name] = propertySchema;
  }

  let schema = coda.makeObjectSchema({
    properties: properties,
    displayProperty: staticSchema.displayProperty,
    idProperty: staticSchema.idProperty,
    featuredProperties: staticSchema.featuredProperties,
    identity: staticSchema.identity,
  });

  console.log("Returning schema: ", JSON.stringify(schema));
  // Return an array schema as the result.
  return coda.makeSchema({
    type: coda.ValueType.Array,
    items: schema,
  });
}
