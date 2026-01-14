import { TableSupervisionComponent } from "@components";

export default function Table() {
  return (
    <>
      <div>
        <TableSupervisionComponent
          title="Resource"
          fetchControl={{
            path: "resources",
          }}
          columnControl={[
            {
              selector: "name",
              label: "Name",
              sortable: true,
              filterable: true,
              width: "350px",
            },
            {
              selector: "type",
              label: "Type",
              sortable: false,
              width: "150px",
            },
            {
              selector: "capacity",
              label: "Capacity",
              sortable: true,
              width: "250px",
            },
            {
              selector: "description",
              label: "Description",
              width: "250px",
            },
          ]}
          detailControl={[
            {
              label: "Name",
              item: "name",
              
            },
            {
              label: "Type",
              item: "type",
            },
            {
              label: "Capacity",
              item: "capacity",
            },
            {
              label: "Description",
              item: "description",
            },
            { label: "Created At", item: "createdAt" },
          ]}
          formControl={{
            fields: [
              {
                construction: {
                  name: "name",
                  label: "Name",
                  placeholder: "Ex: Meeting Room A",
                  validations: ["required"],
                },
              },
              {
                construction: {
                  name: "type",
                  label: "Type",
                  placeholder: "Ex: Room",
                  validations: ["required"],
                },
              },
              {
                construction: {
                  name: "capacity",
                  label: "Capacity",
                  type: "number",
                  placeholder: "Ex: 50",
                  validations: ["required"],
                },
              },
              {
                construction: {
                  type: "textarea",
                  name: "description",
                  label: "Description",
                },
              },
            ],
            contentType: "application/json",
          }}
          controlBar={["CREATE", "FILTER", "SEARCH", "SORT", "SELECTABLE", "REFRESH"]}
          responsiveControl={{
            mobile: true,
          }}
        />
      </div>
    </>
  );
}
