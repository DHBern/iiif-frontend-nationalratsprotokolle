import * as React from 'react';
import Loading from '../Loading';
import './treeview.css';
import ITree from "../interface/ITree";
import TreeBuilder from "./TreeBuilder";
import CaretDownIcon from '@material-ui/icons/ArrowDropDown';
import CaretRightIcon from '@material-ui/icons/ArrowRight';


interface IPros {
    tree?: ITree;
    level: number;
    currentFolderId?: string;
    isOpen?: boolean;
    setCurrentManifest: (id: string) => void;
}

interface IState {
    isOpen: boolean;
    tree?: ITree;
}

class TreeViewItem extends React.Component<IPros, IState> {


    constructor(props: IPros) {

        super(props);

        this.state = {isOpen: this.props.isOpen === true, tree: this.props.tree};
    }

    render() {
        const data = this.state.tree;

        if (!data) {
            return <Loading/>;
        }

        const style = {marginLeft: (this.props.level - 1) * 10};
        let className = 'treeview-item level-' + this.props.level;
        let classNameCaret = 'treeview-caret';
        let caret = <></>;
        const iconStyle = {
            color: "#8C8C8C",
            fontSize: 32
        }

        if ((!data.children || data.children.length === 0) && data.hasLockedChildren !== true) {
            classNameCaret += ' no-caret';
        } else if (this.state.isOpen) {
            caret = <CaretDownIcon style={iconStyle} />;
        } else {
            caret = <CaretRightIcon style={iconStyle} />;
        }
        if (data.id === this.props.currentFolderId) {
            className += ' current';
        }
        const label = data.label;


        const children: any = [];
        if (this.state.isOpen) {
            const childrenLevel = this.props.level + 1;
            if (data.children) {
                for (const child of data.children) {
                    children.push(
                        <TreeViewItem
                            level={childrenLevel}
                            key={child.id}
                            tree={child}
                            isOpen={child.isOpen}
                            currentFolderId={this.props.currentFolderId}
                            setCurrentManifest={this.props.setCurrentManifest}
                        />
                    );
                }
            }
        }

        return (
            <div>
                <div className={className} style={style}>
                    <div className={classNameCaret} onClick={() => this.toggleCaret()}>
                        {caret}
                    </div>
                    <div className="treeview-label" onClick={() => this.props.setCurrentManifest(data.id)}>{label}</div>
                </div>
                {children}
            </div>
        );
    }

    toggleCaret() {

        if (this.state.isOpen) {
            this.setState({isOpen: false});
            return;
        }

        this.setOpen();
    }

    isSubTreeMissing() {
        return (
            this.props.tree &&
            this.props.tree.hasLockedChildren &&
            this.props.tree.children.length === 0
        )
    }

    loadSubTree() {
        if (this.props.tree) {
            const t = this;
            TreeBuilder.get(this.props.tree.id, undefined, (tree) => {
                t.setState({tree, isOpen: true})
            }, true);
        }

    }

    setOpen() {
        if (this.isSubTreeMissing()) {
            this.loadSubTree();
        } else {
            this.setState({isOpen: true});
        }
    }
}

export default TreeViewItem;
