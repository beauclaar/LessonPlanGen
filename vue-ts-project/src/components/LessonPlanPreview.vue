<template>
  <v-container role="region" aria-label="Lesson Plan Preview">
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex justify-end">
        <v-btn
          color="primary"
          class="mr-2"
          prepend-icon="mdi-pencil"
          @click="$emit('edit')"
          aria-label="Edit lesson plan"
        >
          Edit
        </v-btn>
        <v-btn
          color="success"
          prepend-icon="mdi-file-pdf-box"
          @click="downloadPDF"
          aria-label="Download lesson plan as PDF"
        >
          Download PDF
        </v-btn>
      </v-col>
    </v-row>

    <div ref="previewContent" class="preview-content">
      <!-- Introduction Section -->
      <v-card class="mb-4">
        <v-card-title>
          <h1 class="text-h4">{{ lessonPlan.title || 'Untitled Lesson Plan' }}</h1>
        </v-card-title>
        <v-card-text>
          <dl class="preview-details">
            <div class="detail-item">
              <dt>Grade Level:</dt>
              <dd>{{ lessonPlan.gradeLevel }}</dd>
            </div>
            <div class="detail-item">
              <dt>Topic:</dt>
              <dd>{{ lessonPlan.topic }}</dd>
            </div>
            <div class="detail-item">
              <dt>Duration:</dt>
              <dd>{{ lessonPlan.duration }} minutes</dd>
            </div>
          </dl>
        </v-card-text>
      </v-card>

      <!-- Language Domains Section -->
      <v-card class="mb-4">
        <v-card-title>
          <h2 class="text-h5">Language Domains</h2>
        </v-card-title>
        <v-card-text>
          <div role="group" aria-label="Selected language domains">
            <v-chip-group>
              <v-chip
                v-for="domain in lessonPlan.languageDomains"
                :key="domain"
                color="primary"
                aria-label="Language domain:"
              >
                {{ domain }}
              </v-chip>
            </v-chip-group>
          </div>
          <div class="mt-2">
            <strong id="proficiency-label">Proficiency Levels:</strong>
            <div role="group" aria-labelledby="proficiency-label">
              {{ lessonPlan.proficiencyLevels.join(', ') }}
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Objectives Section -->
      <v-card class="mb-4">
        <v-card-title>Objectives</v-card-title>
        <v-card-text>
          <div class="mb-3">
            <strong>Content Objective:</strong>
            <p>{{ lessonPlan.contentObjective }}</p>
          </div>
          <div>
            <strong>Language Target:</strong>
            <p>{{ lessonPlan.languageTarget }}</p>
          </div>
        </v-card-text>
      </v-card>

      <!-- Supports Section -->
      <v-card class="mb-4">
        <v-card-title>Supports</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <strong>Sensory Supports:</strong>
              <ul>
                <li v-for="support in lessonPlan.sensorySupports" :key="support">
                  {{ support }}
                </li>
              </ul>
            </v-col>
            <v-col cols="12" md="4">
              <strong>Graphic Supports:</strong>
              <ul>
                <li v-for="support in lessonPlan.graphicSupports" :key="support">
                  {{ support }}
                </li>
              </ul>
            </v-col>
            <v-col cols="12" md="4">
              <strong>Interactive Supports:</strong>
              <ul>
                <li v-for="support in lessonPlan.interactiveSupports" :key="support">
                  {{ support }}
                </li>
              </ul>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Activities Section -->
      <v-card class="mb-4">
        <v-card-title>Learning Activities</v-card-title>
        <v-card-text>
          <ul>
            <li v-for="activity in lessonPlan.activities" :key="activity">
              {{ activity }}
            </li>
          </ul>
        </v-card-text>
      </v-card>

      <!-- Assessments Section -->
      <v-card class="mb-4">
        <v-card-title>Assessments</v-card-title>
        <v-card-text>
          <!-- Formative Assessments -->
          <div class="mb-4">
            <h3 class="text-h6">Formative Assessments</h3>
            <v-row>
              <v-col v-for="(assessment, index) in lessonPlan.formativeAssessments" 
                    :key="index" 
                    cols="12" 
                    md>
                <strong>Day {{ index + 1 }}:</strong>
                <div>{{ assessment.assessment }}</div>
                <div class="text-caption">{{ assessment.notes }}</div>
              </v-col>
            </v-row>
          </div>

          <!-- Summative Assessments -->
          <div class="mb-4">
            <h3 class="text-h6">Summative Assessments</h3>
            <v-row>
              <v-col cols="12" md="6">
                <strong>Content Assessment:</strong>
                <div>{{ lessonPlan.contentSummativeAssessment.selectedAssessment }}</div>
                <div v-if="lessonPlan.contentSummativeAssessment.otherAssessment">
                  {{ lessonPlan.contentSummativeAssessment.otherAssessment }}
                </div>
                <div class="text-caption">{{ lessonPlan.contentSummativeAssessment.notes }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <strong>Language Assessment:</strong>
                <div>{{ lessonPlan.languageSummativeAssessment.selectedAssessment }}</div>
                <div v-if="lessonPlan.languageSummativeAssessment.otherAssessment">
                  {{ lessonPlan.languageSummativeAssessment.otherAssessment }}
                </div>
                <div class="text-caption">{{ lessonPlan.languageSummativeAssessment.notes }}</div>
              </v-col>
            </v-row>
          </div>

          <!-- Assessment Notes -->
          <div v-if="lessonPlan.assessmentNotes" class="mt-4">
            <strong>Additional Notes:</strong>
            <p>{{ lessonPlan.assessmentNotes }}</p>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useStore } from 'vuex';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default defineComponent({
  name: 'LessonPlanPreview',
  emits: ['edit'],
  setup() {
    const store = useStore();
    const previewContent = ref<HTMLElement | null>(null);
    const lessonPlan = computed(() => store.getters['lessonPlan/currentLessonPlan']);

    const downloadPDF = () => {
      // Create PDF in portrait mode, letter size
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'letter'
      });
      
      // Set initial position and constants
      let yPos = 40;
      const margin = 40;
      const pageWidth = doc.internal.pageSize.width;
      const contentWidth = pageWidth - (2 * margin);

      // Helper function to check page break
      const checkPageBreak = (height: number) => {
        if (yPos + height > doc.internal.pageSize.height - margin) {
          doc.addPage();
          yPos = margin;
          return true;
        }
        return false;
      };

      // Title Section
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      const title = lessonPlan.value.title || 'Lesson Plan';
      doc.text(title, pageWidth / 2, yPos, { align: 'center' });
      yPos += 40;

      // Overview Table
      checkPageBreak(100);
      const overviewData = [
        ['Grade Level', lessonPlan.value.gradeLevel],
        ['Topic', lessonPlan.value.topic],
        ['Duration', `${lessonPlan.value.duration} minutes`],
        ['Language Domains', lessonPlan.value.languageDomains.join(', ')],
        ['Proficiency Levels', lessonPlan.value.proficiencyLevels.join(', ')]
      ];

      autoTable(doc, {
        startY: yPos,
        head: [['Category', 'Details']],
        body: overviewData,
        theme: 'grid',
        headStyles: { fillColor: [71, 85, 119] },
        styles: { cellPadding: 5 },
        columnStyles: { 
          0: { cellWidth: 150 },
          1: { cellWidth: 'auto' }
        }
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 20;

      // Objectives Section
      checkPageBreak(120);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Objectives', margin, yPos);
      yPos += 20;

      autoTable(doc, {
        startY: yPos,
        head: [['Type', 'Objective']],
        body: [
          ['Content', lessonPlan.value.contentObjective],
          ['Language', lessonPlan.value.languageTarget]
        ],
        theme: 'grid',
        headStyles: { fillColor: [71, 85, 119] },
        styles: { cellPadding: 5 },
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 'auto' }
        }
      });

      yPos = (doc as any).lastAutoTable.finalY + 20;

      // Supports Section
      checkPageBreak(160);
      doc.setFontSize(14);
      doc.text('Supports', margin, yPos);
      yPos += 20;

      const supportsData = [
        ['Sensory', lessonPlan.value.sensorySupports.join('\n')],
        ['Graphic', lessonPlan.value.graphicSupports.join('\n')],
        ['Interactive', lessonPlan.value.interactiveSupports.join('\n')]
      ];

      autoTable(doc, {
        startY: yPos,
        head: [['Type', 'Supports Used']],
        body: supportsData,
        theme: 'grid',
        headStyles: { fillColor: [71, 85, 119] },
        styles: { 
          cellPadding: 5,
          fontSize: 10
        },
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 'auto' }
        }
      });

      yPos = (doc as any).lastAutoTable.finalY + 20;

      // Activities Section
      checkPageBreak(120);
      doc.setFontSize(14);
      doc.text('Learning Activities', margin, yPos);
      yPos += 20;

      const activitiesList = lessonPlan.value.activities.map(
        (activity, index) => [`${index + 1}`, activity]
      );

      autoTable(doc, {
        startY: yPos,
        head: [['#', 'Activity']],
        body: activitiesList,
        theme: 'grid',
        headStyles: { fillColor: [71, 85, 119] },
        styles: { cellPadding: 5 },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 'auto' }
        }
      });

      yPos = (doc as any).lastAutoTable.finalY + 20;

      // Formative Assessments
      checkPageBreak(120);
      doc.setFontSize(14);
      doc.text('Formative Assessments', margin, yPos);
      yPos += 20;

      const formativeData = lessonPlan.value.formativeAssessments.map(
        (assessment, index) => [
          `Day ${index + 1}`,
          assessment.assessment,
          assessment.notes || '-'
        ]
      );

      autoTable(doc, {
        startY: yPos,
        head: [['Day', 'Assessment', 'Notes']],
        body: formativeData,
        theme: 'grid',
        headStyles: { fillColor: [71, 85, 119] },
        styles: { 
          cellPadding: 5,
          fontSize: 10
        },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 200 },
          2: { cellWidth: 'auto' }
        }
      });

      yPos = (doc as any).lastAutoTable.finalY + 20;

      // Summative Assessments
      checkPageBreak(120);
      doc.setFontSize(14);
      doc.text('Summative Assessments', margin, yPos);
      yPos += 20;

      const summativeData = [
        ['Content', 
         lessonPlan.value.contentSummativeAssessment.selectedAssessment,
         lessonPlan.value.contentSummativeAssessment.notes || '-'],
        ['Language', 
         lessonPlan.value.languageSummativeAssessment.selectedAssessment,
         lessonPlan.value.languageSummativeAssessment.notes || '-']
      ];

      autoTable(doc, {
        startY: yPos,
        head: [['Type', 'Assessment', 'Notes']],
        body: summativeData,
        theme: 'grid',
        headStyles: { fillColor: [71, 85, 119] },
        styles: { 
          cellPadding: 5,
          fontSize: 10
        },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 200 },
          2: { cellWidth: 'auto' }
        }
      });

      yPos = (doc as any).lastAutoTable.finalY + 20;

      // Additional Notes (if any)
      if (lessonPlan.value.assessmentNotes) {
        checkPageBreak(100);
        doc.setFontSize(14);
        doc.text('Additional Notes', margin, yPos);
        yPos += 20;

        autoTable(doc, {
          startY: yPos,
          body: [[lessonPlan.value.assessmentNotes]],
          theme: 'plain',
          styles: { 
            cellPadding: 5,
            fontSize: 10
          }
        });
      }

      // Save the PDF with a formatted filename
      const filename = title.toLowerCase().replace(/\s+/g, '-');
      doc.save(`${filename}.pdf`);
    };

    return {
      lessonPlan,
      previewContent,
      downloadPDF
    };
  }
});
</script>

<style scoped>
.preview-content {
  max-width: 100%;
}

.preview-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 0;
}

.detail-item {
  margin: 0;
}

dt {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

dd {
  margin-left: 0;
}

/* Ensure proper focus indicators for interactive elements */
:focus {
  outline: 2px solid var(--v-primary-base);
  outline-offset: 2px;
}

/* High contrast mode improvements */
@media (forced-colors: active) {
  .v-card {
    border: 1px solid CanvasText;
  }
  
  .v-btn {
    border: 2px solid ButtonText;
  }
}
</style>