import React from 'react';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { createTemplateList, loadTemplateLists, deleteTemplateList } from '../../actions/templateLists';

import MaterialTable from 'material-table';
import moment from 'moment';
import { useTranslate } from "react-translate";

function TemplateListTable({
    createTemplateList,
    deleteTemplateList,
    loadTemplateLists,
    columns,
    data,
    history,
    lang
}) {
    let t = useTranslate("AnalysisTemplate");
    const handleCellClick = (event, row) => {
        history.push(`/editAnalysisTemplate/${row.id}`)
    }
    return (
        <MaterialTable
            title={t(`analysisTemplate_title-${lang}`)}
            columns={columns}
            data={data}
            onRowClick={handleCellClick}
            editable={{
                onRowAdd: async newData => {
                    await createTemplateList({created_at: moment().format("YYYY-MM-DD"), org_id: localStorage.getItem('org_id'), ...newData});
                    await loadTemplateLists();
                },
                onRowDelete: async oldData => {
                    await deleteTemplateList(oldData.id);
                    await loadTemplateLists();
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

const mapDispatchToProps = {
    createTemplateList, 
    loadTemplateLists, 
    deleteTemplateList
};

export default connect(null, mapDispatchToProps)(withRouter(TemplateListTable));