import { IStore, IProject, ITask, IBreak, ITag, ITaskTag } from "../model/store";
import { RestClient, Response, Promise, createRestClient } from "./RestClient";
import js2xmlparser from "js2xmlparser";

import "../../mock/simple.xml";

class XmlUtil {
    private static tagNameMap: { [tagName: string]: string} = {
        projectid: "projectId",
        taskid: "taskId",
        breakid: "breakId",
        tagid: "tagId",
        startdate: "startDate",
        enddate: "endDate",
        starttime: "startTime",
        endtime: "startTime",
        lastupdate: "lastUpdate",
        locationend: "locationEnd",
        phonenumber: "phoneNumber",
        rateid: "rateId"
    };

    public static loadMockXml(): Promise<IStore> {
        let restClient: RestClient = createRestClient();

        return restClient({
            path: "mock/simple.xml"
        }).then((result: Response) => {
            let xmlContent: string = result.entity;

            return XmlUtil.convertXmlToStore(xmlContent);
        });
    }

    public static convertStoreToXml(state: IStore): string {
        let xmlStr: string = js2xmlparser("root", state, {
            arrayMap: {
                projects: "project",
                tasks: "task",
                tags: "tag",
                taskTags: "taskTag"
            }
        });

        return xmlStr;
    }

    public static convertXmlToStore(xmlContent: string): IStore {
        let xmlDocument: JQuery = $(xmlContent);
        let store: IStore = {
            projects: <IProject[]> XmlUtil.findAndConvert(xmlDocument, "projects project"),
            tasks: <ITask[]> XmlUtil.findAndConvert(xmlDocument, "tasks task"),
            breaks: <IBreak[]> XmlUtil.findAndConvert(xmlDocument, "breaks break"),
            tags: <ITag[]> XmlUtil.findAndConvert(xmlDocument, "tags tag"),
            taskTags: <ITaskTag[]> XmlUtil.findAndConvert(xmlDocument, "tasktags tasktag")
        };

        return store;
    }

    private static findAndConvert(xmlDocument: JQuery, selector: string): Object[] {
        let elements: JQuery = xmlDocument.find(selector);
        let objects: any = elements.map((index: number, domElement: Element) => XmlUtil.mapToObject(domElement));

        return $.makeArray(objects);
    }

    private static mapToObject(element: Element): Object {
        let objectRepresentation: Object = {};

        $(element).children().each((index: number, child: Element) => {
            let tagName: string = child.tagName.toLowerCase();
            let key: string = XmlUtil.getKeyName(tagName);

            objectRepresentation[key] = XmlUtil.getValue(child.textContent);
        });

        return objectRepresentation;
    }

    private static getKeyName(tagName: string): string {
        let keyName: string = XmlUtil.tagNameMap[tagName];

        return keyName ? keyName : tagName;
    }

    private static getValue(value: any): string|number|boolean {
        if (value === "") {
            return null;
        }

        if (value === "true" || value === "false") {
            return value === "true";
        }

        if (isNaN(value) === false) {
            return parseFloat(value);
        } else {
            return value;
        }
    }
}

export default XmlUtil;
