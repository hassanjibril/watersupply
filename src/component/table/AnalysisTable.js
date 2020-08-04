import React from 'react';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { createAnalysis, loadAnalysises, deleteAnalysis, analysisListSelector } from '../../actions/analysis';

import MaterialTable from 'material-table';
import moment from 'moment';
import { useTranslate } from "react-translate";

function AnalysisTable({
    createAnalysis,
    loadAnalysises,
    deleteAnalysis,
    columns,
    data,
    history,
    lang
}) {
    let t = useTranslate("WaterAnalysis");
    return (
        <MaterialTable
            title={t(`analysis_title-${lang}`)}
            columns={columns}
            data={data}
            editable={{
                onRowAdd: async newData => {
                    await createAnalysis({created_at: moment().format("YYYY-MM-DD"), org_id: localStorage.getItem('org_id'), ...newData});
                    await loadAnalysises();
                },
                onRowDelete: async oldData => {
                    await deleteAnalysis(oldData.id);
                    await loadAnalysises();
                }
            }}
            actions={[
                {
                    icon: 'edit',
                    tooltip: 'Edit',
                    onClick: (event, rowData) => {
                        history.push(`/editWaterAnalysis/${rowData.id}`)
                    }
                }
            ]}
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
    analysisList: analysisListSelector(state)
});

const mapDispatchToProps = {
    createAnalysis, 
    loadAnalysises, 
    deleteAnalysis
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AnalysisTable));