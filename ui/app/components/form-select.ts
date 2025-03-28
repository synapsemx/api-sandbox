import { action } from '@ember/object';
import Component from '@glimmer/component';

export type Option = {
  label: string;
  value: string;
};

export interface FormSelectComponentSignature {
  Args: {
    options: Option[];
    placeholder: string;
    selectedOptions?: string[];
  };
}

export default class FormSelectComponent extends Component<FormSelectComponentSignature> {
  get selectedOptions() {
    return this.args.selectedOptions || [];
  }

  @action
  isSelected(option: Option) {
    return this.selectedOptions.includes(option.value);
  }
}
