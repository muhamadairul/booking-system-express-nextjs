import { TableSupervisionComponent } from "@components";

export default function Table() {
  return (
    <>
      <div>
        <TableSupervisionComponent
          title="Schedule"
          fetchControl={{
            path: "schedules",
          }}
          columnControl={[
            {
              selector: "name",
              label: "Resource",
              filterable: true,
              width: "350px",
            },
            {
              selector: "startTime",
              label: "Start Time",
              sortable: true,
              filterable: true,
              width: "250px",
            },
            {
              selector: "endTime",
              label: "End Time",
              sortable: true,
              filterable: true,
              width: "250px",
            },
            {
              selector: "price",
              label: "Price",
              sortable: true,
              filterable: true,
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
