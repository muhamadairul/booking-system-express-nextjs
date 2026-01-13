import { TableSupervisionComponent } from "@components";

export default function Table() {
  return (
    <>
      <div>
        <TableSupervisionComponent
          title="Role"
          fetchControl={{
            headers: { "Content-Type": "application/json" },
            path: "roles",
          }}
          columnControl={[
            {
              selector: "name",
              label: "Nama",
              sortable: true,
              filterable: true,
              width: "350px",
            },
            {
              selector: "slug",
              label: "Slug",
              sortable: true,
              width: "250px",
            },
          ]}
          detailControl={[
            {
              label: "Nama",
              item: "name",
            },
            {
              label: "Slug",
              item: "slug",
            },
          ]}
          formControl={{
            fields: [
              {
                construction: {
                  name: "name",
                  label: "Nama",
                  placeholder: "Ex: Admin",
                  validations: ["required"],
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
