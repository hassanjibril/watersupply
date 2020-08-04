import React from 'react';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { createPayment, loadPayments, deletePayment, paymentListSelector } from '../../actions/payment';

import MaterialTable from 'material-table';
import moment from 'moment';
import { useTranslate } from "react-translate";

function CustomTable({
    createPayment,
    loadPayments,
    deletePayment,
    paymentList,
    columns,
    data,
    history,
    lang
}) {
    let t = useTranslate("PaymentTerms");
    const handleCellClick = (event, row) => {
        history.push(`/editPaymentTerms/${row.id}`)
    }
    return (
        <MaterialTable
            title={t(`payment_title-${lang}`)}
            columns={columns}
            data={data}
            onRowClick={handleCellClick}
            editable={{
                onRowAdd: async newData => {
                    await createPayment({created_at: moment().format("YYYY-MM-DD"), org_id: localStorage.getItem('org_id'), ...newData});
                    await loadPayments();
                },
                onRowDelete: async oldData => {
                    await deletePayment(oldData.id);
                    await loadPayments();
                }
            }}
            options={{
                headerStyle: {
                    backgroundColor: '#673ab7',
                    color: '#FFF',
                    padding: "10px"
                },
                rowStyle: {
                    backgroundColor: '#EEE',
                },
                searchFieldStyle: {
                    fontSize: "1.3rem",
                    width: "100%",
                },
            }}
        />
    )
}

const mapStateToProps = state => ({
    paymentList: paymentListSelector(state)
});

const mapDispatchToProps = {
    createPayment, 
    loadPayments, 
    deletePayment
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CustomTable));