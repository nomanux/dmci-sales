import { NavigationProvider, useNavigation } from "./NavigationContext";
import Login from "./Login";
import Login0 from "./Login0";
import ProfilePage from "./ProfilePage";
import ChangePasswordPage from "./ChangePasswordPage";
import Dashboard from "./Dashboard";
import PropertiesListView from "./PropertiesListView";
import ProjectDetails from "./ProjectDetails";
import TowerList from "./TowerList";
import FloorList from "./FloorList";
import UnitList from "./UnitList";
import ParkingSlotList from "./ParkingSlotList";
import ServiceAreaList from "./ServiceAreaList";
import UnitAvailabilityList from "./UnitAvailabilityList";
import UnitAvailabilityDetails from "./UnitAvailabilityDetails";
import UnitHoldingList from "./UnitHoldingList";
import UnitHoldingDetails from "./UnitHoldingDetails";
import ClientsList from "./ClientsList";
import AdvanceCommissionList from "./AdvanceCommissionList";
import AdvanceCommissionDetails from "./AdvanceCommissionDetails";
import RegularCommissionList from "./RegularCommissionList";
import RegularCommissionDetails from "./RegularCommissionDetails";
import ForComplianceList from "./ForComplianceList";
import ForComplianceDetails from "./ForComplianceDetails";
import LotteryRegistrationList from "./LotteryRegistrationList";
import LotteryUnitPicker from "./LotteryUnitPicker";
import ComputationSheet from "./ComputationSheet";
import ReservationPayment from "./ReservationPayment";
import RAForm from "./RAForm";
import CaptureSelfieTrack from "./CaptureSelfieTrack";
import RAFormV2 from "./RAFormV2";

function Screens() {
  const { route } = useNavigation();

  switch (route.screen) {
    case "login":
      return <Login />;
    case "login0":
      return <Login0 />;
    case "profile":
      return <ProfilePage />;
    case "change-password":
      return <ChangePasswordPage />;
    case "dashboard":
      return <Dashboard />;
    case "properties":
      return <PropertiesListView />;
    case "project-details":
      return <ProjectDetails />;
    case "tower":
      return <TowerList />;
    case "floor":
      return <FloorList />;
    case "unit":
      return <UnitList />;
    case "parking-slot":
      return <ParkingSlotList />;
    case "service-area":
      return <ServiceAreaList />;
    case "unit-availability":
      return <UnitAvailabilityList />;
    case "unit-availability-details":
      return <UnitAvailabilityDetails />;
    case "unit-holding":
      return <UnitHoldingList />;
    case "unit-holding-details":
      return <UnitHoldingDetails />;
    case "clients":
      return <ClientsList />;
    case "advance-commission":
      return <AdvanceCommissionList />;
    case "advance-commission-details":
      return <AdvanceCommissionDetails />;
    case "regular-commission":
      return <RegularCommissionList />;
    case "regular-commission-details":
      return <RegularCommissionDetails />;
    case "compliance":
      return <ForComplianceList />;
    case "compliance-details":
      return <ForComplianceDetails />;
    case "lottery-registration":
      return <LotteryRegistrationList />;
    case "lottery-unit-picker":
      return <LotteryUnitPicker />;
    case "computation-sheet":
      return <ComputationSheet />;
    case "payment-method":
      return <ReservationPayment />;
    case "ra-form":
      return <RAForm />;
    case "capture-selfie-track":
      return <CaptureSelfieTrack />;
    case "ra-form-v2":
      return <RAFormV2 />;
    default:
      return <Login />;
  }
}

/** App — wires every DMCI Homes Sales CRF/RA screen together behind a lightweight in-memory router. */
export default function App() {
  const getInitialRoute = () => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const step = new URLSearchParams(window.location.search).get("step") ?? "buyer-property";
      if (path === "/ra-form" || path === "/ra-form1" || path === "/capture-selfie-track") {
        return { screen: "capture-selfie-track" as const, step };
      }
      if (path === "/ra-form2") {
        return { screen: "ra-form-v2" as const, step };
      }
    }
    return undefined;
  };

  return (
    <NavigationProvider initialRoute={getInitialRoute()}>
      <Screens />
    </NavigationProvider>
  );
}
