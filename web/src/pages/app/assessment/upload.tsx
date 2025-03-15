import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUploadCloud } from "react-icons/fi";
import {
  useUploadAssessmentMutation,
  useGetSubjectsQuery,
} from "../../../store/api/assessmentApi";
import { toast } from "react-toastify";
import { Combobox } from "@headlessui/react";
import useScript from "../../../hooks/useScript";
import { MdCloudUpload, MdDescription } from "react-icons/md";

interface UploadForm {
  title: string;
  subject: string;
  questionCount: number;
  document: File | null;
  text: string;
}

const Upload = () => {
  const navigate = useNavigate();
  const [uploadAssessment, { isLoading }] = useUploadAssessmentMutation();
  const { data: existingSubjects = [] } = useGetSubjectsQuery();
  const [query, setQuery] = useState("");

  const [formData, setFormData] = useState<UploadForm>({
    title: "",
    subject: "",
    questionCount: 20,
    document: null,
    text: "",
  });
  const [isExtracting, setIsExtracting] = useState(false);

  // Load PDF.js scripts
  useScript(
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.min.js"
  );
  useScript(
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js"
  );

  const filteredSubjects =
    query === ""
      ? existingSubjects
      : existingSubjects.filter((subject: string) =>
          subject.toLowerCase().includes(query.toLowerCase())
        );

  const extractTextFromFile = async (file: File): Promise<string> => {
    try {
      if (file.type === "text/plain") {
        return await file.text();
      }

      if (file.type === "application/pdf") {
        if (!(window as any).pdfjsLib) {
          throw new Error("PDF.js library not loaded");
        }

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await (window as any).pdfjsLib.getDocument({
          data: arrayBuffer,
        }).promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(" ");
          fullText += pageText + "\n";
        }

        return fullText;
      }

      throw new Error("Unsupported file type");
    } catch (error) {
      console.error("Text extraction error:", error);
      throw new Error("Failed to extract text from file");
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (
      file &&
      (file.type === "application/pdf" || file.type === "text/plain")
    ) {
      setIsExtracting(true);
      try {
        const text = await extractTextFromFile(file);
        setFormData((prev) => ({ ...prev, document: file, text }));
      } catch (error) {
        toast.error("Failed to extract text from file");
      } finally {
        setIsExtracting(false);
      }
    } else {
      toast.error("Please upload a PDF or TXT file");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf" && file.type !== "text/plain") {
        toast.error("Please upload a PDF or TXT file");
        return;
      }

      setIsExtracting(true);
      try {
        const text = await extractTextFromFile(file);
        setFormData((prev) => ({ ...prev, document: file, text }));
      } catch (error) {
        toast.error("Failed to extract text from file");
      } finally {
        setIsExtracting(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.subject || !formData.text) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const payload = {
        title: formData.title,
        subject: formData.subject,
        questionCount: formData.questionCount,
        content: formData.text,
      };

      await uploadAssessment(payload).unwrap();
      toast.success("Document uploaded successfully");
      navigate("/app/assessments");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to upload document");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <MdCloudUpload className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Create New Assessment
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Upload your study material and we'll generate questions for you
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Assessment Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="e.g., Introduction to Biology"
                required
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700"
              >
                Subject
              </label>
              <Combobox
                value={formData.subject}
                onChange={(value) =>
                  setFormData((prev: any) => ({ ...prev, subject: value }))
                }
              >
                <div className="relative">
                  <Combobox.Input
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    onChange={(e) => setQuery(e.target.value)}
                    displayValue={(subject: string) => subject}
                    placeholder="Select or enter subject"
                  />
                  <Combobox.Options className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto border border-gray-100">
                    {filteredSubjects.map((subject: string) => (
                      <Combobox.Option
                        key={subject}
                        value={subject}
                        className={({
                          selected,
                          active,
                        }: {
                          selected: boolean;
                          active: boolean;
                        }) =>
                          `${active ? "bg-primary text-white" : "text-gray-900"}
                          ${selected ? "font-medium" : "font-normal"}
                          cursor-pointer select-none relative py-3 px-4 hover:bg-primary/5 transition-colors`
                        }
                      >
                        {subject}
                      </Combobox.Option>
                    ))}
                    {query && !filteredSubjects.includes(query) && (
                      <Combobox.Option
                        value={query}
                        className="cursor-pointer select-none relative py-3 px-4 text-primary hover:bg-primary/5 transition-colors"
                      >
                        Create "{query}"
                      </Combobox.Option>
                    )}
                  </Combobox.Options>
                </div>
              </Combobox>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Study Material
              </label>
              <label
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={`mt-2 flex justify-center rounded-lg border-2 border-dashed p-8
                  ${
                    formData.document
                      ? "border-primary bg-primary/5"
                      : "border-gray-300 hover:border-primary"
                  }
                  transition-colors cursor-pointer relative`}
              >
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.txt"
                  onChange={handleFileChange}
                />
                <div className="text-center">
                  {isExtracting ? (
                    <div className="space-y-3">
                      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-sm text-gray-500">
                        Extracting text from File...
                      </p>
                    </div>
                  ) : formData.document ? (
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                        <MdDescription className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary">
                          {formData.document.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(formData.document.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setFormData((prev) => ({
                            ...prev,
                            document: null,
                            text: "",
                          }));
                        }}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                        <FiUploadCloud className="h-6 w-6 text-primary" />
                      </div>
                      <p className="mt-4 text-sm text-gray-500">
                        Drag and drop your PDF here, or click to browse
                      </p>
                      <p className="mt-2 text-xs text-gray-500">
                        PDF or TXT files only, up to 10MB
                      </p>
                    </>
                  )}
                </div>
              </label>
            </div>

            <div>
              <label
                htmlFor="questionCount"
                className="block text-sm font-medium text-gray-700"
              >
                Number of Questions
              </label>
              <input
                type="number"
                id="questionCount"
                value={formData.questionCount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    questionCount: Math.max(1, parseInt(e.target.value)),
                  }))
                }
                className="mt-1 block w-32 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                min="1"
                max="50"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Recommended: 20-30 questions
              </p>
            </div>

            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate("/app/assessments")}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || isExtracting || !formData.document}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating..." : "Create Assessment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;
