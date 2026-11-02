import { useState } from "react";
import { useNavigation } from "./NavigationContext";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";
import DatePicker from "./DatePicker";

interface FormData {
  // Step 1: Buyer & Property Information
  buyerType?: string;
  buyerClassification?: string;
  controlNumber?: string;
  reservationDate?: string;
  propertyName?: string;
  unitLotNo?: string;
  unitCategory?: string;
  buildingName?: string;
  area?: string;
  listPrice?: string;

  // Step 2: Buyer Details
  clientType?: string;
  buyerPrefix?: string;
  buyerFirstName?: string;
  buyerLastName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  buyerCitizenship?: string;
  buyerIDType?: string;
  buyerIDNumber?: string;

  // Step 3: Co-Buyer Information
  hasCobuyer?: boolean;
  coBuyerFirstName?: string;
  coBuyerLastName?: string;
  coBuyerEmail?: string;
  coBuyerPhone?: string;
  coBuyerCitizenship?: string;
  coBuyerIDType?: string;
  coBuyerIDNumber?: string;

  // Step 4: Broker Information
  brokerName?: string;
  brokerEmail?: string;
  brokerPhone?: string;
  brokerLicense?: string;
  brokerCompany?: string;

  // Step 5: Payment Terms
  totalContractPrice?: string;
  reservationFee?: string;
  downpaymentPercentage?: string;
  paymentSchedule?: string;

  // Step 6: Terms and Conditions
  acceptTerms?: boolean;
  acceptPrivacy?: boolean;

  // Step 7: Document Upload
  proofOfPayment?: string;
  governmentID?: string;

  // Step 8: Review & Submit
  reviewConfirmed?: boolean;
}

const RAForm = () => {
  const { navigate } = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    buyerType: "primary",
    buyerClassification: "",
    controlNumber: "",
    propertyName: "",
    unitLotNo: "",
    unitCategory: "",
    buildingName: "",
    area: "",
    listPrice: "",
  });

  const handleFieldChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem("raFormDraft", JSON.stringify(formData));
    alert("Form saved as draft");
  };

  const handleSubmit = () => {
    console.log("Final Form Data:", formData);
    alert("RA Form submitted successfully");
    navigate({ screen: "dashboard" });
  };

  const renderProgressBar = () => {
    return (
      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-[1024px] mx-auto px-8 py-3">
          <p className="text-xs font-normal text-gray-900 mb-2">
            {currentStep + 1}/8 steps
          </p>
          <div className="flex gap-1.5 h-1.5">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 rounded-full ${
                  i < currentStep + 1 ? "bg-brand-400" : "bg-gray-100"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="bg-white rounded-3xl shadow-sm">
      <div className="pt-5 px-8 pb-3">
        <h2 className="text-xl font-bold text-brand-500 text-center mb-1">
          Buyer & Property Information
        </h2>
        <p className="text-center text-sm text-gray-700">
          Review and confirm buyer type and property details for this
          reservation.
        </p>
      </div>

      <div className="p-5 space-y-4">
        {/* Top 3 fields */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Buyer Type <span className="text-error-500">*</span>
            </label>
            <Select
              placeholder="Select buyer type"
              value={formData.buyerType}
              onChange={(value) => handleFieldChange("buyerType", value)}
              options={[
                { label: "Primary buyer", value: "primary" },
                { label: "Co-buyer", value: "cobuyer" },
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Buyer Classification <span className="text-error-500">*</span>
            </label>
            <Select
              placeholder="Select one"
              value={formData.buyerClassification}
              onChange={(value) =>
                handleFieldChange("buyerClassification", value)
              }
              options={[
                { label: "Individual", value: "individual" },
                { label: "Corporate", value: "corporate" },
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Control Number (RA No.)
            </label>
            <Input
              placeholder="-"
              value={formData.controlNumber}
              onChange={(e) =>
                handleFieldChange("controlNumber", e.target.value)
              }
              disabled
            />
          </div>
        </div>

        {/* Reservation Agreement Section */}
        <div className="bg-reservation-bg flex flex-col items-start pb-1.5 pt-0 px-1.5 relative rounded-2xl">
          {/* Header */}
          <div className="flex gap-3 items-center justify-center py-1.5 rounded-none shrink-0 w-full">
            <h3 className="text-base font-semibold text-reservation-heading">
              Reservation Agreement
            </h3>
          </div>

          {/* Content - Horizontal Layout */}
          <div className="bg-white flex gap-5 items-end px-5 py-3 relative rounded-lg shrink-0 w-full">
            {/* Left: Labels (283px wide) */}
            <div className="flex flex-col gap-0.5 items-start relative shrink-0 w-[283px]">
              {/* Label + Asterisk */}
              <div className="flex gap-0.5 items-start relative shrink-0 whitespace-nowrap">
                <label className="font-semibold text-sm text-gray-700">
                  Date of Reservation
                </label>
                <span className="font-medium text-sm text-[#06318a]">*</span>
              </div>

              {/* Helper Text */}
              <p className="font-normal text-xs text-gray-700 whitespace-nowrap">
                This is subject to validation of payment.
              </p>
            </div>

            {/* Right: Input (301px wide) */}
            <div className="w-[301px]">
              <DatePicker
                value={formData.reservationDate}
                onChange={(value) =>
                  handleFieldChange("reservationDate", value)
                }
                placeholder="MM/DD/YYYY"
              />
            </div>
          </div>
        </div>

        {/* Property Information */}
        <div>
          <h3 className="text-base font-semibold text-brand-500 mb-3">
            Property Information
          </h3>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Property Name
              </label>
              <Input
                placeholder="Alta Vista De Boracay"
                value={formData.propertyName}
                onChange={(e) =>
                  handleFieldChange("propertyName", e.target.value)
                }
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Unit / Lot No. / Parking Slot No.
              </label>
              <Input
                placeholder="SON-00A-C-02008"
                value={formData.unitLotNo}
                onChange={(e) => handleFieldChange("unitLotNo", e.target.value)}
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Unit Category
              </label>
              <Input
                placeholder="Condo unit"
                value={formData.unitCategory}
                onChange={(e) =>
                  handleFieldChange("unitCategory", e.target.value)
                }
                disabled
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Building Name
              </label>
              <Input
                placeholder="Sample Building Name"
                value={formData.buildingName}
                onChange={(e) =>
                  handleFieldChange("buildingName", e.target.value)
                }
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Area (M²)
              </label>
              <Input
                placeholder="1200"
                value={formData.area}
                onChange={(e) => handleFieldChange("area", e.target.value)}
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                List Price (Php)
              </label>
              <Input
                placeholder="6,500,000"
                value={formData.listPrice}
                onChange={(e) => handleFieldChange("listPrice", e.target.value)}
                disabled
              />
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center p-5 border-t border-gray-200">
        <button
          onClick={handleSaveDraft}
          className="text-sm font-semibold text-brand-500 hover:text-brand-600"
        >
          Save as draft
        </button>
        <div className="flex gap-4">
          {currentStep > 0 && (
            <Button onClick={handlePrevious} variant="secondary">
              Previous
            </Button>
          )}
          <Button onClick={handleNext} variant="primary">
            {currentStep === 7 ? "Submit" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="bg-white rounded-3xl shadow-lg">
      <div className="pt-5 px-8 pb-3">
        <h2 className="text-xl font-bold text-brand-500 text-center mb-1">
          Client/Company Representative
        </h2>
        <p className="text-center text-sm text-gray-700">
          Enter your personal information as it appears on your official
          records.
        </p>
      </div>

      <div className="p-5 space-y-4">
        {/* Client Type Selection */}
        <div className="flex gap-4 items-start">
          <div
            className={`flex-1 border rounded-xl p-4 cursor-pointer transition-all ${
              formData.clientType === "individual"
                ? "bg-brand-50 border-brand-500"
                : "bg-white border-gray-300"
            }`}
            onClick={() => handleFieldChange("clientType", "individual")}
          >
            <div className="flex gap-3 items-start">
              <div
                className={`w-5 h-5 rounded-full mt-1 flex items-center justify-center border-2 ${
                  formData.clientType === "individual"
                    ? "bg-brand-600 border-brand-600"
                    : "border-gray-300"
                }`}
              >
                {formData.clientType === "individual" && (
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Private Individual
                </p>
                <p className="text-xs text-gray-700 mt-1">
                  I am a private individual OR a representative of a private
                  partnership.
                </p>
              </div>
            </div>
          </div>

          <p className="text-gray-400 self-center">or</p>

          <div
            className={`flex-1 border rounded-xl p-4 cursor-pointer transition-all ${
              formData.clientType === "company"
                ? "bg-white border-brand-500"
                : "bg-white border-gray-300"
            }`}
            onClick={() => handleFieldChange("clientType", "company")}
          >
            <div className="flex gap-3 items-start">
              <div
                className={`w-5 h-5 rounded-full mt-1 flex items-center justify-center border-2 ${
                  formData.clientType === "company"
                    ? "bg-brand-600 border-brand-600"
                    : "border-gray-300"
                }`}
              >
                {formData.clientType === "company" && (
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-700">
                  Company representative
                </p>
                <p className="text-xs text-gray-700 mt-1">
                  I am a representative of a company or corporation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-brand-500">
            Personal Details
          </h3>

          {/* Prefix, First Name, Last Name */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Prefix <span className="text-error-500">*</span>
              </label>
              <Select
                placeholder="Select prefix"
                value={formData.buyerPrefix}
                onChange={(value) => handleFieldChange("buyerPrefix", value)}
                options={[
                  { label: "Mr", value: "mr" },
                  { label: "Ms", value: "ms" },
                  { label: "Mrs", value: "mrs" },
                  { label: "Dr", value: "dr" },
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                First Name <span className="text-error-500">*</span>
              </label>
              <Input
                placeholder="Enter first name"
                value={formData.buyerFirstName}
                onChange={(e) =>
                  handleFieldChange("buyerFirstName", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Last Name <span className="text-error-500">*</span>
              </label>
              <Input
                placeholder="Enter last name"
                value={formData.buyerLastName}
                onChange={(e) =>
                  handleFieldChange("buyerLastName", e.target.value)
                }
              />
            </div>
          </div>

          {/* Email, Phone, Citizenship */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email <span className="text-error-500">*</span>
              </label>
              <Input
                placeholder="Enter email"
                type="email"
                value={formData.buyerEmail}
                onChange={(e) =>
                  handleFieldChange("buyerEmail", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone <span className="text-error-500">*</span>
              </label>
              <Input
                placeholder="Enter phone"
                value={formData.buyerPhone}
                onChange={(e) =>
                  handleFieldChange("buyerPhone", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Citizenship <span className="text-error-500">*</span>
              </label>
              <Select
                placeholder="Select citizenship"
                value={formData.buyerCitizenship}
                onChange={(value) =>
                  handleFieldChange("buyerCitizenship", value)
                }
                options={[
                  { label: "Filipino", value: "philippine" },
                  { label: "Foreign", value: "foreign" },
                ]}
              />
            </div>
          </div>

          {/* ID Type, ID Number */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                ID Type <span className="text-error-500">*</span>
              </label>
              <Select
                placeholder="Select ID type"
                value={formData.buyerIDType}
                onChange={(value) => handleFieldChange("buyerIDType", value)}
                options={[
                  { label: "Passport", value: "passport" },
                  { label: "Driver's License", value: "license" },
                  { label: "National ID", value: "national" },
                  { label: "TIN", value: "tin" },
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                ID Number <span className="text-error-500">*</span>
              </label>
              <Input
                placeholder="Enter ID number"
                value={formData.buyerIDNumber}
                onChange={(e) =>
                  handleFieldChange("buyerIDNumber", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center p-5 border-t border-gray-200">
        <button
          onClick={handleSaveDraft}
          className="text-sm font-semibold text-brand-500 hover:text-brand-600"
        >
          Save as draft
        </button>
        <div className="flex gap-4">
          {currentStep > 0 && (
            <Button onClick={handlePrevious} variant="secondary">
              Previous
            </Button>
          )}
          <Button onClick={handleNext} variant="primary">
            {currentStep === 7 ? "Submit" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderOtherSteps = () => (
    <div className="bg-white rounded-3xl shadow-sm p-8 text-center">
      <h2 className="text-2xl font-bold text-brand-500 mb-4">
        Step {currentStep + 1}
      </h2>
      <p className="text-gray-600 mb-8">
        This step is under development. Coming soon.
      </p>
      <div className="flex justify-between items-center">
        <button className="text-sm font-semibold text-brand-500">
          Save as draft
        </button>
        <div className="flex gap-4">
          <Button disabled={currentStep === 0} onClick={handlePrevious}>
            Previous
          </Button>
          <Button variant="primary" onClick={handleNext}>
            {currentStep === 7 ? "Submit" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/src/assets/dmci-logo.svg"
              alt="DMCI Homes Sales"
              className="h-8 w-auto"
            />
          </div>
          <Button onClick={() => navigate({ screen: "dashboard" })}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      {renderProgressBar()}

      {/* Main Content */}
      <div className="max-w-[1024px] mx-auto px-5 py-4">
        {currentStep === 0
          ? renderStep1()
          : currentStep === 1
            ? renderStep2()
            : renderOtherSteps()}
      </div>
    </div>
  );
};

export default RAForm;
