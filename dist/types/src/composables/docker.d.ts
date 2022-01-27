export declare const useDocker: () => {
    dockerize: ({ name, image }: dockerArgs) => Promise<void>;
    undockerize: ({ name }: dockerArgs) => Promise<void>;
};
interface dockerArgs {
    name: string;
    image?: string;
}
export {};
//# sourceMappingURL=docker.d.ts.map