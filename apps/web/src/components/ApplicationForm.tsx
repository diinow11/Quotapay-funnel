import * as React from "react";
import { Upload, X, FileText, AlertCircle } from "lucide-react";

interface PersonalDetailsProps {
  onSubmit: (data: { fullName: string; phone: string; idNumber: string }) => void;
}

export function PersonalDetailsStep({ onSubmit }: PersonalDetailsProps) {
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [idNumber, setIdNumber] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 3) errs.fullName = "Enter your full name";
    if (!phone.trim() || !/^(07|01|\+254)\d{8,}$/.test(phone.replace(/\s/g, "")))
      errs.phone = "Enter a valid phone number (e.g. 0712345678)";
    if (!idNumber.trim() || !/^\d{6,8}$/.test(idNumber.trim()))
      errs.idNumber = "Enter a valid National ID number (6-8 digits)";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({ fullName: fullName.trim(), phone: phone.trim(), idNumber: idNumber.trim() });
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Your <span className="text-green-600">details</span>
        </h1>
        <p className="mt-2 text-gray-600">We need this to process your application.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            autoComplete="name"
            placeholder="John Kamau"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
          {errors.fullName && <p className="mt-1 text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" />{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            autoComplete="tel"
            placeholder="0712345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" />{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">National ID Number</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="12345678"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, "").slice(0, 8))}
            className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
          {errors.idNumber && <p className="mt-1 text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" />{errors.idNumber}</p>}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 w-full rounded-xl bg-green-600 py-4 text-base font-bold text-white shadow-md transition-all hover:bg-green-700 active:scale-95"
      >
        Continue
      </button>
    </div>
  );
}

interface FileUploadStepProps {
  onSubmit: (files: File[], mpesaPasscode: string) => void;
}

export function FileUploadStep({ onSubmit }: FileUploadStepProps) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [mpesaPasscode, setMpesaPasscode] = React.useState("");
  const [error, setError] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const MAX_FILES = 6;
  const MAX_SIZE_MB = 10;

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    setError("");
    const valid: File[] = [];
    for (const file of Array.from(newFiles)) {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`${file.name} is too large (max ${MAX_SIZE_MB}MB)`);
        continue;
      }
      if (file.type !== "application/pdf") {
        setError(`${file.name} is not a PDF. Only PDF files are accepted.`);
        continue;
      }
      valid.push(file);
    }
    setFiles((prev) => [...prev, ...valid].slice(0, MAX_FILES));
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (files.length === 0) {
      setError("Please upload at least one statement");
      return;
    }
    onSubmit(files, mpesaPasscode.trim());
  };

  const getFileIcon = () => {
    return <FileText className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Upload your <span className="text-green-600">statement</span>
        </h1>
        <p className="mt-2 text-gray-600">
          Last 3 months M-Pesa or bank statement. Photos or PDF.
        </p>
      </div>

      {/* Drop zone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition-all hover:border-green-400 hover:bg-green-50 active:scale-[0.98]"
      >
        <Upload className="mx-auto h-10 w-10 text-gray-400" />
        <p className="mt-3 font-semibold text-gray-700">Tap to upload</p>
        <p className="mt-1 text-sm text-gray-500">PDF only — max {MAX_SIZE_MB}MB each</p>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />

      {/* M-Pesa Statement Passcode */}
      <div className="mt-5">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          M-Pesa Statement Passcode
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Safaricom M-Pesa statements are password-protected. Enter the 6-digit passcode so we can open it.
        </p>
        <input
          type="text"
          inputMode="numeric"
          placeholder="e.g. 123456"
          maxLength={6}
          value={mpesaPasscode}
          onChange={(e) => setMpesaPasscode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-green-500 focus:ring-1 focus:ring-green-500 tracking-widest text-center text-lg font-mono"
        />
        <p className="mt-1 text-xs text-gray-400">Leave blank if uploading a bank statement</p>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />{error}
        </p>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2">
              <div className="flex items-center gap-2 min-w-0">
                {getFileIcon()}
                <span className="truncate text-sm text-gray-700">{file.name}</span>
                <span className="shrink-0 text-xs text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(1)}MB
                </span>
              </div>
              <button
                onClick={() => removeFile(i)}
                className="shrink-0 ml-2 p-1 text-gray-400 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <p className="text-xs text-gray-500 text-center">
            {files.length}/{MAX_FILES} files uploaded
          </p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="mt-6 w-full rounded-xl bg-green-600 py-4 text-base font-bold text-white shadow-md transition-all hover:bg-green-700 active:scale-95"
      >
        Continue
      </button>
    </div>
  );
}
