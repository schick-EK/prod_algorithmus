import {
  AnnotationInput,
  INPUT_SCHEMA_VERSION,
  PIPELINE_VERSION,
  RESULT_SCHEMA_VERSION,
} from "./contracts";
import { digest } from "./hash";
import { ontology } from "./ontology";
import { annotate } from "./pipeline";

/** A deterministic pilot handoff; audio and sampling-event exports remain AP2 work. */
export function buildAnnotationBundle(inputs: AnnotationInput[]) {
  const annotations = inputs.map((input) => annotate(input));
  const content = { inputs, annotations, ontology };
  return {
    manifest: {
      schema_version: "ap3-bundle/0.1.0",
      observation_count: inputs.length,
      versions: {
        input: INPUT_SCHEMA_VERSION,
        result: RESULT_SCHEMA_VERSION,
        pipeline: PIPELINE_VERSION,
        ontology: ontology.version,
      },
      hashes: {
        inputs: digest(inputs),
        annotations: digest(annotations),
        ontology: digest(ontology),
        content: digest(content),
      },
      calibration: "none",
      scope: "experimental_ap1_subset",
    },
    ...content,
  };
}
