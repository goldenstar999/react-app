import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import { styles } from '../../../styles';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

class SingleSelectDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      label: props.label,
      groups: props.groups,
      selectedItemIndex: this.getSelectedItemFromGroups(props.groups),
      callbackOnChange: props.callbackOnChange
    }
  }

  getSelectedItemFromGroups = (groups) => {
    let selectedItemIndex = -1

    for (let i = 0; i < groups.length; i ++) {
      let group = groups[i]

      if (group.isChecked) {
        selectedItemIndex = group.value
      } else {
        for (let j = 0; j < group.options.length; j ++) {
          let option = group.options[j]

          if (option.isChecked) {
            selectedItemIndex = option.value
          }
        }
      }
    }

    return selectedItemIndex
  }

  componentWillReceiveProps(nextProps) {
    const { label, groups, onChange } = nextProps
    console.log('==== SingleSelectDropdowon: groups: ', groups)
    let selectedItemIndex = this.getSelectedItemFromGroups(groups)

    this.setState({
      label,
      groups,
      selectedItemIndex,
      callbackOnChange: onChange
    })
  }

  isGroup = (name) => {
    const { groups } = this.state
    let res = false

    for (let i = 0; i < groups.length; i ++) {
      let group = groups[i]

      if (group.value === name) {
        res = true
        break
      }
    }

    return res
  }

  getOptionByName = (name) => {
    const { groups } = this.state
    let res = null

    for (let i = 0; i < groups.length; i ++) {
      let group = groups[i]

      if (group.options && group.options.length > 0) {
        for (let j = 0; j < group.options.length; j ++) {
          let option = group.options[j]
          if (option === name) {
            res = option
            break
          }
        }
      }
    }

    return res
  }

  checkOptions = (groups, selectedItems) => {
    let newSelectedItems = selectedItems
    for (let i = 0; i < groups.length; i ++) {
      let group = groups[i]
      // Check all options with selectedItems
      if (group.options && group.options.length > 0) {
        let count = 0

        for (let j = 0; j < group.options.length; j ++) {
          let option = group.options[j]
          if (selectedItems.indexOf(option.value) > -1) {
            count ++
          }
        }
        let groupIndexInItems = selectedItems.indexOf(group.value)
        if (count === group.options.length) {
          if (groupIndexInItems === -1) {
            newSelectedItems.push(group.value)
          }
        } else {
          if (groupIndexInItems > -1) {
            newSelectedItems.splice(groupIndexInItems, 1)
          }
        }
      }
    }

    return newSelectedItems
  }

  reviseGroupsbySelectedItems = (selectedItems) => {
    const { groups, currentSelectedItems } = this.state
    let newSelectedItems = selectedItems

    // Check new / removed group items
    let newItemName = null
    if (currentSelectedItems.length > selectedItems.length) {
      newItemName = this.getNewSelectedItem(currentSelectedItems, selectedItems)
      if (this.isGroup(newItemName)) {
        newSelectedItems = this.removeAllOptions(newItemName, selectedItems)
      }
    } else {
      newItemName = this.getNewSelectedItem(selectedItems, currentSelectedItems)
      if (this.isGroup(newItemName)) {
        newSelectedItems = this.selectAllOptions(newItemName, selectedItems)
      }
    }

    newSelectedItems = this.checkOptions(groups, newSelectedItems)

    return newSelectedItems
  }

  selectAllOptions(groupName, selectedItems) {
    const { groups } = this.state
    let updatedItems = selectedItems

    // select or unselect all sub options
    let selectedGroup = groups.find((group) => {
      return group.value === groupName
    })

    if (selectedGroup.options) {
      for (let i = 0; i < selectedGroup.options.length; i ++) {
        let option = selectedGroup.options[i]
        // select all
        if (updatedItems.indexOf(option.value) === -1) {
          updatedItems.push(option.value)
        }
      }
    }

    return updatedItems
  }

  removeItem = (name, items) => {
    let index = items.indexOf(name)
    let updatedItems = items

    if (index > -1) {
      updatedItems.splice(index, 1)
    }

    return updatedItems
  }

  removeAllOptions(groupName, selectedItems) {
    const { groups } = this.state
    let removedItems = selectedItems

    // select or unselect all sub options
    let selectedGroup = groups.find((group) => {
      return group.value === groupName
    })

    // Remove group from selected items
    removedItems = this.removeItem(groupName, selectedItems)

    // Remove options of the group
    if (selectedGroup.options) {
      for (let i = 0; i < selectedGroup.options.length; i ++) {
        let option = selectedGroup.options[i]
        removedItems = this.removeItem(option.value, removedItems)
      }
    }

    return removedItems
  }

  // must be many firstItems than secondItems
  getNewSelectedItem(firstItems, secondItems) {
    let i = 0;

    for(i = 0; i < firstItems.length; i ++) {
      if (secondItems.indexOf(firstItems[i]) === -1) {
        return firstItems[i]
      }
    }

    return firstItems[i]
  }

  selectedItems2Groups = (selectedItems, groups) => {
    let newGroups = groups
    for (let i = 0; i < newGroups.length; i ++) {
      let group = newGroups[i]

      // Check groups
      if (selectedItems.indexOf(group.value) > -1 ) {
        group.isChecked = true
      } else {
        group.isChecked = false
      }

      // Check options
      for (let j = 0; j < group.options.length; j ++) {
        let option = group.options[j]
        if (selectedItems.indexOf(option.value) > -1 ) {
          option.isChecked = true
        } else {
          option.isChecked = false
        }
      }
    }

    return newGroups
  }

  handleChange = event => {
    const { callbackOnChange, groups } = this.state
    // const selectedItems = this.reviseGroupsbySelectedItems(event.target.value)
    // const newGroups = this.selectedItems2Groups(selectedItems, groups)
    let newGroups = groups
    let selectedItemIndex = event.target.value

    for (let i = 0; i < newGroups.length; i++) {
      let group = newGroups[i]
      if (group.value === event.target.value) {
        group.isChecked = true
      } else {
        group.isChecked = false
      }
        for (let j = 0; j < group.options.length; j++) {
          let option = group.options[j]
          if (option.value === event.target.value) {
            option.isChecked = true
          } else {
            option.isChecked = false
          }
        }

    }

    this.setState({
      selectedItemIndex: selectedItemIndex,
      groups: newGroups
    }, () => {
      const { groups } = this.state
      if (callbackOnChange) {
        callbackOnChange(groups)
      }
    })
  }

  renderValueByIndex = (index) => {
    const { groups } = this.state

    for (let i = 0; i < groups.length; i++) {
      let group = groups[i]
      if (group.value === index) {
        return (
          <Typography variant="subtitle1" gutterBottom>
            {group.label}
          </Typography>
        )
      }
      for (let j = 0; j < group.options.length; j++) {
        let option = group.options[j]
        if (option.value === index) {
          return  (
            <Typography variant="subtitle1" gutterBottom>
              {`${group.label}: ${option.label}`}
            </Typography>
          )
        }
      }
    }

    return <Typography />
  }

  render () {
    const { classes } = this.props;
    const { label, groups, selectedItemIndex } = this.state;

    return (
      <div className={classes.root}>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="select-multiple-checkbox">{label}</InputLabel>
          <Select
            autoWidth = {true}
            value={selectedItemIndex}
            onChange={this.handleChange}
            input={<Input id="select-multiple-checkbox" />}
            MenuProps={MenuProps}
            renderValue={selected => this.renderValueByIndex(selectedItemIndex)}
          >
            {groups && groups.map((group, index) => {
              let group_items = []
              group_items.push(
                <MenuItem key={`position_${index}`} value={group.value} className={classes.groupMenuItem} >
                  {<Checkbox checked={selectedItemIndex === group.value} color="primary"/>}
                  <ListItemText primary={group.label ? group.label : ''} />
                </MenuItem>
              )
              let group_sub_items = []
              if (group.options) {
                group_sub_items = group.options.map((option, index) => {
                  return (
                    <MenuItem key={`sub_position_${index}`} value={option.value} className={classes.optionMenuItem}>
                      {<Checkbox
                        checked={selectedItemIndex === option.value}
                        color="primary"/>}
                      <ListItemText primary={option.label ? option.label : ''} />
                    </MenuItem>
                  )}
                )
                group_items.push(group_sub_items)
              }

              return (
                group_items
              )}
            )}
          </Select>
        </FormControl>
      </div>
    );
  }
}

// SingleSelectDropdown.propTypes = {
//   classes: PropTypes.object.isRequired,
//   theme: PropTypes.object.isRequired,
// };

export default withStyles(styles, { withTheme: true })(SingleSelectDropdown);
