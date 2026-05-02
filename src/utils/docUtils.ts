import * as XLSX from "xlsx";
import {
  Document as DocxDoc,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
} from "docx";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import type { Task, User } from "@/types";
import { formatDate } from "./helpers";

function userNameById(users: User[], id: string) {
  return users.find((u) => u.id === id)?.name ?? "Unassigned";
}

export function exportTasksToExcel(
  tasks: Task[],
  users: User[],
  filename = "tasks",
) {
  const rows = tasks.map((t) => ({
    Title: t.title,
    Status: t.status,
    Priority: t.priority,
    "Assigned To": userNameById(users, t.assignedTo),
    "Due Date": t.dueDate,
    "Created At": t.createdAt,
    Tags: t.tags.join(", "),
    Description: t.description,
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  ws["!cols"] = [
    { wch: 30 },
    { wch: 14 },
    { wch: 12 },
    { wch: 20 },
    { wch: 14 },
    { wch: 14 },
    { wch: 20 },
    { wch: 50 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Tasks");
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

export async function exportTasksToWord(
  tasks: Task[],
  users: User[],
  filename = "tasks",
) {
  const doc = new DocxDoc({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: "TaskFlow — Task Report",
            heading: HeadingLevel.TITLE,
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: `Generated: ${formatDate(new Date().toISOString())}`,
            spacing: { after: 600 },
            run: { color: "888888", size: 20 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  "Title",
                  "Status",
                  "Priority",
                  "Assigned To",
                  "Due Date",
                ].map(
                  (h) =>
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: h, bold: true })],
                        }),
                      ],
                    }),
                ),
              }),
              ...tasks.map(
                (t) =>
                  new TableRow({
                    children: [
                      t.title,
                      t.status,
                      t.priority,
                      userNameById(users, t.assignedTo),
                      t.dueDate,
                    ].map(
                      (val) =>
                        new TableCell({
                          children: [
                            new Paragraph({
                              text: String(val),
                              alignment: AlignmentType.LEFT,
                            }),
                          ],
                        }),
                    ),
                  }),
              ),
            ],
          }),
          ...tasks
            .map((t) => [
              new Paragraph({
                text: t.title,
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 500, after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Description: ", bold: true }),
                  new TextRun(t.description),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Tags: ", bold: true }),
                  new TextRun(t.tags.join(", ") || "—"),
                ],
              }),
            ])
            .flat(),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${filename}.docx`);
}

export function exportTasksToPDF(
  tasks: Task[],
  users: User[],
  filename = "tasks",
) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(99, 102, 241);
  doc.text("TaskFlow — Task Report", 14, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(130, 130, 130);
  doc.text(`Generated: ${formatDate(new Date().toISOString())}`, 14, 25);

  const headers = [
    ["#", "Title", "Status", "Priority", "Assigned To", "Due Date", "Tags"],
  ];
  const rows = tasks.map((t, i) => [
    String(i + 1),
    t.title.length > 35 ? t.title.slice(0, 34) + "…" : t.title,
    t.status,
    t.priority,
    userNameById(users, t.assignedTo),
    t.dueDate,
    t.tags.slice(0, 3).join(", "),
  ]);

  (doc as any).autoTable({
    head: headers,
    body: rows,
    startY: 30,
    styles: { font: "helvetica", fontSize: 9, cellPadding: 3 },
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [248, 248, 255] },
    margin: { left: 14, right: 14 },
  });

  doc.save(`${filename}.pdf`);
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) ?? "");
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function downloadDocumentFile(doc: { name: string; dataUrl: string }) {
  const link = window.document.createElement("a");
  link.href = doc.dataUrl;
  link.download = doc.name;
  link.click();
}
