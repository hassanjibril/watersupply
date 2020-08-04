import React from 'react';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { 
    createAnalysisTemplate, 
    updateAnalysisTemplate,
    loadAnalysisTemplates, 
    deleteAnalysisTemplate, 
    analysisTemplateListSelector 
} from '../../actions/analysisTemplate';

import MaterialTable from 'material-table';
import { useTranslate } from "react-translate";
import moment from 'moment';

function AnalysisTemplateTable({
    createAnalysisTemplate,
    loadAnalysisTemplates,
    deleteAnalysisTemplate,
    columns,
    data,
    lang,
    id
}) {
    let t = useTranslate("AnalysisTemplate");
    return (
        <MaterialTable
            title={t(`analysisTemplate_title-${lang}`)}
            columns={columns}
            data={data}
            editable={{
                onRowAdd: async newData => {
                    await createAnalysisTemplate({created_at: moment().format("YYYY-MM-DD"), org_id: localStorage.getItem('org_id'), template_id: id,...newData});
                    await loadAnalysisTemplates();
                },
                // onRowUpdate: async (newData, oldData) => {
                //     await updateAnalysisTemplate({
                //         ...oldData,
                //         ...newData,
                //         template_id: id,
                //         org_id: localStorage.getItem('org_id')
                //     })
                //     await loadAnalysisTemplates();
                // },
                onRowDelete: async oldData => {
                    await deleteAnalysisTemplate(oldData.id);
                    await loadAnalysisTemplates();
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
    analysisTemplateList: analysisTemplateListSelector(state),
});

const mapDispatchToProps = {
    createAnalysisTemplate, 
    loadAnalysisTemplates, 
    deleteAnalysisTemplate,
    updateAnalysisTemplate
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AnalysisTemplateTable));