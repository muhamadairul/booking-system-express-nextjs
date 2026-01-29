"use client";
import { TableSupervisionComponent } from "@components";

export function formatDateTime(value: string | Date, locale: string = "id-ID") {
  if (!value) return "-";

  const date = typeof value === "string" ? new Date(value) : value;

  if (isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

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
            (data: any) => {
              return (
                <div
                  key={"schedule-label-n"}
                  style={{ marginTop: "20px", marginBottom: "10px" }}
                >
                  <TableSupervisionComponent
                    title="Schedule"
                    key={"schedule-n"}
                    actionControl={["EDIT", "DELETE"]}
                    // id={data.id}
                    fetchControl={{
                      path: `schedules/resource/${data.id}`,
                    }}
                    columnControl={[
                      {
                        selector: "startTime",
                        label: "Start Time",
                        item: (data: any) => formatDateTime(data.startTime),
                        sortable: true,
                        width: "250px",
                      },
                      {
                        selector: "endTime",
                        label: "End Time",
                        item: (data: any) => formatDateTime(data.endTime),
                        sortable: true,
                        width: "250px",
                      },
                    ]}
                    formControl={{
                      contentType: "application/json",
                      fields: [
                        {
                          type: "select",
                          construction: {
                            name: "day",
                            label: "Day",
                            placeholder: "--- Select Day ---",
                            options: [
                              { label: "Monday", value: "MON" },
                              { label: "Tuesday", value: "TUE" },
                              { label: "Wednesday", value: "WED" },
                              { label: "Thursday", value: "THU" },
                              { label: "Friday", value: "FRI" },
                              { label: "Saturday", value: "SAT" },
                              { label: "Sunday", value: "SUN" },
                            ],
                            validations: ["required"],
                          },
                        },

                        ...(data?.bookingMode === "FLEXIBLE"
                          ? [
                              {
                                construction: {
                                  name: "openTime",
                                  label: "Open Time",
                                  type: "time",
                                  // validations: ["required"],
                                },
                              },
                              {
                                construction: {
                                  name: "closeTime",
                                  label: "Close Time",
                                  type: "time",
                                  // validations: ["required"],
                                },
                              },
                              {
                                construction: {
                                  name: "pricePerHour",
                                  label: "Price Per Hour",
                                  type: "number",
                                  // validations: ["required"],
                                },
                              },
                            ]
                          : [
                              {
                                construction: {
                                  name: "startTime",
                                  label: "Start Time",
                                  type: "time",
                                  // validations: ["required"],
                                },
                              },
                              {
                                construction: {
                                  name: "endTime",
                                  label: "End Time",
                                  type: "time",
                                  // validations: ["required"],
                                },
                              },
                            ]),
                            {
                              type: "default",
                              construction: {
                                type: "button",

                              }
                            }
                      ],
                    }}
                  />
                </div>
              );
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
                type: "select",
                construction: {
                  type: "select",
                  name: "bookingMode",
                  label: "Booking Mode",
                  placeholder: "--- Select Booking Mode ---",
                  options: [
                    {
                      label: "Fleksible",
                      value: "FLEXIBLE",
                    },
                    {
                      label: "Fixed Slot",
                      value: "FIXED_SLOT",
                    },
                  ],
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
