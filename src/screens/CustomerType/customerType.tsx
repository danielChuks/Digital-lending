import React, { useEffect } from 'react';
import styles from './customerType.module.css';
// import IndividualIcon from '../../assets/icons/customerType/group.png';
// import NonIndividualIcon from '../../assets/icons/customerType/non-individual.png';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import { useCustomerContext } from '../../context/customerDetailsContext';
import { IoPeople } from 'react-icons/io5';
import { IoMdPerson } from 'react-icons/io';

const CustomerType = () => {
    const navigate = useNavigate();
    const { CustomerData, setCustomerData } = useCustomerContext();

    useEffect(() => {
        const basicInfo = {
            email: '',
            mobile: '',
            strDateOfBirth: '',
            nextOfKin: '',
            spouseName: '',
            titleCd: null,
            lastName: '',
            middleName: '',
            firstName: '',
            customerType: '',
            nationalityCd: null,
            industryId: '',
            countryOfResidenceId: '',
            maritalStatus: '',

            countryOfBirthId: '',
            gender: '',
            occupationCd: '',
            employmentFlag: false,
            noOfDependents: '',

            organisationName: '',
            registrationNumber: '',
            strRegistrationDate: '',
        };

        const addressInfo = {
            primaryAddressCity: '',
            primaryAddressLine1: '',
            primaryAddressLine2: '',
            primaryAddressLine3: '',
            primaryAddressLine4: '',
            primaryAddressState: '',
            strFromDate: '',
            primaryAddressCountryCd: '',
            addressTypeId: '',
        };

        const otherInfo = {
            openingReasonCd: '',
            marketingCampaignCd: '',
            sourceOfFundCd: '',
            amountUnit: '',
            monthlyIncomeAmount: '',
        };
        setCustomerData((prev) => ({
            ...prev,
            basicInfoData: basicInfo,
            addressInfoData: addressInfo,
            otherInfoData: otherInfo,
            customerCategory: '',
            identificationInfoData: null,
            documentInfodata: null,
            strphotoGraphImage: null,
            strsignatureImage: null,
            addDocumentFlag: false,
            customerDraftFlag: false,
        }));
    }, []);

    const actionIconsList = [
        {
            id: 2,
            name: 'Individual',
            icon: <IoMdPerson size={100} color={'#006c33'} />,
            path: '/dashboard/createCustomer',
            customerType: 'PER',
        },
        {
            id: 1,
            name: 'Non - Individual',
            icon: <IoPeople size={100} color={'#006c33'} />,
            path: '/dashboard/createCustomer',
            customerType: 'COR',
        },
    ];

    return (
        <div className={'main-container'}>
            <div className={'main-heading'}>Pick a Customer Category</div>
            <section className={styles['customer-type-content']}>
                <div className={styles['customer-type-action-container']}>
                    {actionIconsList.map(
                        ({ id, name, icon, path, customerType }) => (
                            <div
                                key={id}
                                className={styles['action-box']}
                                onClick={() => {
                                    sessionStorage.setItem(
                                        'custCat',
                                        customerType
                                    );
                                    navigate(path);
                                }}
                            >
                                <div className={styles['icon-container']}>
                                    {icon}
                                </div>
                                <div className={styles['action-name']}>
                                    {name}
                                </div>
                            </div>
                        )
                    )}
                </div>
                <div className={styles['buton-container']}>
                    <Button
                        text={'Back'}
                        type={'button'}
                        disabled={false}
                        buttonType={'back'}
                        icon={true}
                        onClick={() => navigate('/login')}
                    />
                </div>
            </section>
        </div>
    );
};

export default CustomerType;
