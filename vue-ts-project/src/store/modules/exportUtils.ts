import { Module } from 'vuex';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { RootState } from '../index';

interface ExportState {
  isExporting: boolean;
  exportError: string | null;
}

const exportUtils: Module<ExportState, RootState> = {
  namespaced: true,

  state: {
    isExporting: false,
    exportError: null
  },

  mutations: {
    SET_EXPORTING(state, value: boolean) {
      state.isExporting = value;
    },
    SET_ERROR(state, error: string | null) {
      state.exportError = error;
    }
  },

  actions: {
    async exportToJSON({ rootState }) {
      try {
        const data = {
          basePlan: rootState.baseLessonPlan.plan,
          frameworks: rootState.baseLessonPlan.activeFrameworks.map(framework => {
            switch (framework) {
              case 'commonCore':
                return {
                  framework: 'commonCore',
                  data: { ...rootState.commonCore }
                };
              case 'nextGenScience':
                return {
                  framework: 'nextGenScience',
                  data: { ...rootState.nextGenScience }
                };
              default:
                return null;
            }
          }).filter(data => data !== null)
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        saveAs(blob, `lesson-plan-${Date.now()}.json`);
        return true;
      } catch (error) {
        console.error('Export error:', error);
        throw new Error('Failed to export lesson plan');
      }
    },

    async exportToPDF({ rootState }) {
      try {
        const doc = new jsPDF();
        const data = rootState.baseLessonPlan.plan;

        // Title
        doc.setFontSize(20);
        doc.text('Lesson Plan', 20, 20);

        // Basic Information
        doc.setFontSize(12);
        doc.text('Basic Information', 20, 40);
        doc.text(`Title: ${data.title}`, 30, 50);
        doc.text(`Topic: ${data.topic}`, 30, 60);
        doc.text(`Time per Session: ${data.timePerSession} minutes`, 30, 70);
        doc.text(`Occurrence: ${data.occurrence}`, 30, 80);
        doc.text(`Duration: ${data.duration}`, 30, 90);

        let yPosition = 110;

        // Framework Data
        rootState.baseLessonPlan.activeFrameworks.forEach(framework => {
          switch (framework) {
            case 'commonCore': {
              const ccData = rootState.commonCore;
              doc.text('Common Core Standards', 20, yPosition);
              doc.text(`Grade: ${ccData.grade}`, 30, yPosition + 10);
              doc.text(`Strand: ${ccData.strand}`, 30, yPosition + 20);
              doc.text('Selected Standards:', 30, yPosition + 30);
              ccData.selectedStandards.forEach((std, idx) => {
                doc.text(`- ${std.code}: ${std.description}`, 40, yPosition + 40 + (idx * 10));
              });
              yPosition += 60 + (ccData.selectedStandards.length * 10);
              break;
            }
            case 'nextGenScience': {
              const ngssData = rootState.nextGenScience;
              doc.text('Next Generation Science Standards', 20, yPosition);
              doc.text(`Grade Level: ${ngssData.gradeLevel}`, 30, yPosition + 10);
              doc.text(`Domain: ${ngssData.scienceDomain}`, 30, yPosition + 20);
              doc.text('Core Ideas:', 30, yPosition + 30);
              ngssData.disciplinaryCoreIdeas.forEach((idea, idx) => {
                doc.text(`- ${idea.code}: ${idea.description}`, 40, yPosition + 40 + (idx * 10));
              });
              yPosition += 60 + (ngssData.disciplinaryCoreIdeas.length * 10);
              break;
            }
          }
        });

        doc.save(`lesson-plan-${Date.now()}.pdf`);
        return true;
      } catch (error) {
        console.error('PDF export error:', error);
        throw new Error('Failed to generate PDF');
      }
    },

    generateLLMPrompt({ rootState }): string {
      const data = rootState.baseLessonPlan.plan;
      let prompt = `Please help me create a detailed lesson plan with the following specifications:

Title: ${data.title}
Topic: ${data.topic}
Time per Session: ${data.timePerSession} minutes
Occurrence: ${data.occurrence}
Duration: ${data.duration}

Applied Frameworks:`;

      rootState.baseLessonPlan.activeFrameworks.forEach(framework => {
        prompt += `\n\n${framework.toUpperCase()}:`;
        switch (framework) {
          case 'commonCore': {
            const ccData = rootState.commonCore;
            prompt += `
Grade: ${ccData.grade}
Strand: ${ccData.strand}
Standards: ${ccData.selectedStandards.map(std => std.code).join(', ')}`;
            break;
          }
          case 'nextGenScience': {
            const ngssData = rootState.nextGenScience;
            prompt += `
Grade Level: ${ngssData.gradeLevel}
Domain: ${ngssData.scienceDomain}
Core Ideas: ${ngssData.disciplinaryCoreIdeas.map(idea => idea.code).join(', ')}
Practices: ${ngssData.sciencePractices.join(', ')}
Crosscutting Concepts: ${ngssData.crossCuttingConcepts.join(', ')}`;
            break;
          }
        }
      });

      prompt += `\n\nPlease provide:
1. Detailed lesson objectives aligned with the selected standards/frameworks
2. Step-by-step lesson activities
3. Required materials and resources
4. Assessment strategies
5. Differentiation strategies for various learner needs`;

      return prompt;
    }
  }
};

export default exportUtils;
