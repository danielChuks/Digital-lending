import { useEffect } from "react";
import {
    createHashRouter,
    RouterProvider,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import "./App.css";
import { AuthendicationRouterControl } from "./navigation/AuthenticationRouter/authendicationRouterControl";
import { Register } from "./screens/Signup/register";
import { Login } from "./screens/Signin/login";
import OtpVerification from "./screens/OtpVerification/otpVerification";
import { ForgotPassword } from "./screens/ForgotPassword/forgotpassword";
import { ChangePassword } from "./screens/ForgotPassword/changepassword";
import { HomeRouterControl } from "./navigation/HomeRouter/homeRouterControl";
import { AccountList } from "./screens/Dashboard/Account/List/accountList";
import { AccountStatement } from "./screens/Dashboard/Account/Statement/statement";
import CustomerType from "./screens/CustomerType/customerType";
import CreateCustomer from "./screens/CreateCustomer/createCustomer";
import CreateCreditApplication from "./screens/createCreditApplication/createCreditApplication";
import CreditApplContext from "./context/creditApplDetailsContext";
import { CustomerDetailsContext } from "./context/customerDetailsContext";
import { PickListContext } from "./context/pickListDataContext";
import { DraftList } from "./screens/Dashboard/Draft/draftList";
import Dashboard from "./screens/Dashboard/dashboard";
import { Track } from "./screens/Dashboard/Track/track";
import FundTransfer from "./screens/Dashboard/FundTransfer/fundTransfer";
import { Message } from "./screens/Dashboard/Message/message";
import { FundPartnersInfo } from "./screens/Dashboard/FundPartnersInformation/fundPartnersInfo";

function App() {
    useEffect(() => {
        fetch("applicationProperties.json")
            .then(function (res) {
                return res.json();
            })
            .then(function (data) {
                sessionStorage.setItem("instituteCode", data.instituteCode);
                sessionStorage.setItem("baseurl", data.baseUrl);
                sessionStorage.setItem("channelCode", data.channelCode);
            })
            .catch(function (err) {});
    }, []);

    const router = createHashRouter(
        createRoutesFromElements(
            <Route>
                <Route path='/' element={<AuthendicationRouterControl />}>
                    <Route index element={<Login />}></Route>
                    <Route path='/login' element={<Login />}></Route>
                    <Route path='/register' element={<Register />}></Route>
                    <Route
                        path='/verification'
                        element={<OtpVerification />}
                    ></Route>
                    <Route
                        path='/forgotPassword'
                        element={<ForgotPassword />}
                    ></Route>
                    <Route
                        path='/changePassword'
                        element={<ChangePassword />}
                    ></Route>
                </Route>
                <Route path='/dashboard' element={<HomeRouterControl />}>
                    <Route index element={<Dashboard />}></Route>
                    <Route
                        path='/dashboard/customerType'
                        element={<CustomerType />}
                    ></Route>
                    <Route
                        path='/dashboard/createCustomer'
                        element={<CreateCustomer />}
                    ></Route>
                    <Route
                        path='/dashboard/account'
                        element={<AccountList />}
                    ></Route>
                    <Route
                        path='/dashboard/account/accountStatement'
                        element={<AccountStatement />}
                    ></Route>
                    <Route
                        path='/dashboard/createCreditApplication'
                        element={<CreateCreditApplication />}
                    ></Route>
                    <Route
                        path={"/dashboard/draftList"}
                        element={<DraftList />}
                    ></Route>
                    <Route
                        path={"/dashboard/track"}
                        element={<Track />}
                    ></Route>
                    <Route
                        path={"/dashboard/fundTransfer"}
                        element={<FundTransfer />}
                    ></Route>
                    <Route
                        path={"/dashboard/fundPartnersInfo"}
                        element={<FundPartnersInfo />}
                    ></Route>
                    <Route
                        path={"/dashboard/message"}
                        element={<Message />}
                    ></Route>
                </Route>
            </Route>
        )
    );
    return (
        <div className='App'>
            <CustomerDetailsContext>
                <CreditApplContext>
                    <PickListContext>
                        <RouterProvider router={router} />
                    </PickListContext>
                </CreditApplContext>
            </CustomerDetailsContext>
        </div>
    );
}

export default App;
