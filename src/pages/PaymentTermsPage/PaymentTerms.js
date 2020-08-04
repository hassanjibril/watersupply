import React, {useEffect} from 'react';
import { PaymentTable } from '../../component/table';
import { connect } from 'react-redux';
import { loadPayments, paymentListSelector } from '../../actions/payment';
import { isLoading } from '../../actions/loading';

import { useTranslate } from "react-translate";
import moment from 'moment';

function PaymentTerms({
    loadPayments,
    paymentList,
    loading,
    lang
}) {
    let t = useTranslate("PaymentTerms");
    useEffect(()=>{
        loadPayments();
    },[])
    const payments = paymentList.filter(payment=>payment.org_id === localStorage.getItem("org_id"));
    var data=[];
    const stateLookup = {
        0 : "active",
        1 : "in active"
    }
    var sortedpayments = payments.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

    for(var i=0; i<sortedpayments.length; i++) {
        data[i]={
            id: sortedpayments[i].id,
            name: sortedpayments[i].name,
            description: sortedpayments[i].description,
            created_at: moment(sortedpayments[i].created_at).format(lang==="en" ? "YYYY-MM-DD" : "MM.DD.YYYY"),
            state: sortedpayments[i].state
        }
    }
    const columns = [
        { title: t(`name-${lang}`), field: 'name', cellStyle: {textDecoration: "underline"} },
        { title: t(`description-${lang}`), field: 'description', disableClick: true },
        { title: t(`created_at-${lang}`), field: 'created_at', editable: 'never', disableClick: true },
        { title: t(`state-${lang}`), field: 'state', lookup: stateLookup, disableClick: true }
    ];
    return loading ? (<div>loading...</div>) : (
        <PaymentTable 
            columns={columns}
            data={data} 
            lang={lang}
        />
    )
}

const mapStateToProps = state => ({
    paymentList: paymentListSelector(state),
    loading: isLoading(loadPayments)(state),
});

const mapDispatchToProps = {
    loadPayments
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentTerms);