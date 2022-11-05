/****************************************************************************************
 * Copyright (c) 2022. HuiiBuh                                                          *
 * This file (typeguards.ts) is part of InstagramDownloader which is not released       *
 * under any licence.                                                                   *
 * Any usage of this code outside this project is not allowed.                          *
 ****************************************************************************************/
import { AlertMessage, DownloadProgress } from './extension';

// tslint:disable-next-line:no-any
export const isDownloadProgress = (message: DownloadProgress |  AlertMessage): message is DownloadProgress => (message as any).percent !== undefined;
